import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from 'react'
import {
  ChatMessage,
  saveConversation,
  getAllConversations,
  clearConversation,
  Conversation
} from '../services/db'
import { generateChatResponse, OpenFileContext } from '../services/ai'
import { FileContext } from './FileContext'
import { FileViewsContext, FileViewsContextType } from './FileViewContext'
import { useL0g1n } from 'l0g1n-sdk'
import { toast } from 'sonner'

export type ChatContextType = {
  conversations: Conversation[]
  activeConversationId: string
  messages: ChatMessage[]
  apiKey: string
  setApiKey: (key: string) => void
  model: string
  setModel: (model: string) => void
  sendMessage: (text: string, mentionedFiles?: string[]) => Promise<void>
  revertToMessage: (id: string) => Promise<string | null>
  createNewConversation: () => void
  switchConversation: (id: string) => void
  deleteConversation: (id: string) => void
  isLoading: boolean
}

export const ChatContext = createContext<ChatContextType>({} as ChatContextType)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] =
    useState<string>('default')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [apiKey, setApiKey] = useState<string>('')
  const [model, setModel] = useState<string>('gemini-flash-latest')
  const [isLoading, setIsLoading] = useState(false)

  const { files } = useContext(FileContext)
  const fileViewsContext = useContext(FileViewsContext)
  const { user } = useL0g1n()

  const loadConversations = async (currentId: string) => {
    const all = await getAllConversations()
    setConversations(all)
    if (all.length > 0) {
      const current = all.find(c => c.id === currentId)
      if (current) {
        setMessages(current.messages)
        setActiveConversationId(current.id)
      } else {
        setMessages(all[0].messages)
        setActiveConversationId(all[0].id)
      }
    } else {
      setMessages([])
    }
  }

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY')
    if (savedKey) setApiKey(savedKey)

    const savedModel = localStorage.getItem('GEMINI_MODEL')
    if (savedModel) setModel(savedModel)

    const savedActiveId =
      localStorage.getItem('GEMINI_ACTIVE_CONV') || 'default'
    loadConversations(savedActiveId)
  }, [])

  const handleSetApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem('GEMINI_API_KEY', key)
  }

  const handleSetModel = (newModel: string) => {
    setModel(newModel)
    localStorage.setItem('GEMINI_MODEL', newModel)
  }

  const createNewConversation = () => {
    const newId = Date.now().toString()
    setActiveConversationId(newId)
    setMessages([])
    localStorage.setItem('GEMINI_ACTIVE_CONV', newId)
    // Don't save to DB until first message is sent
  }

  const switchConversation = (id: string) => {
    setActiveConversationId(id)
    localStorage.setItem('GEMINI_ACTIVE_CONV', id)
    loadConversations(id)
  }

  const deleteConversation = async (id: string) => {
    await clearConversation(id)
    if (activeConversationId === id) {
      localStorage.removeItem('GEMINI_ACTIVE_CONV')
      loadConversations('default')
    } else {
      loadConversations(activeConversationId)
    }
  }

  const getOpenFiles = (): OpenFileContext[] => {
    const flattenTree = (
      node: FileViewsContextType
    ): FileViewsContextType[] => {
      const flatList: FileViewsContextType[] = []
      const traverse = (n: FileViewsContextType) => {
        flatList.push(n)
        if (n.children) {
          n.children.forEach(child => traverse(child))
        }
      }
      traverse(node)
      return flatList
    }

    const flatNodes = flattenTree(fileViewsContext.fileViewsTree)
    const allOpenedFileIds = new Set<string>()
    flatNodes.forEach(n => {
      if (n.openedFiles) {
        n.openedFiles.forEach(id => allOpenedFileIds.add(id))
      }
    })

    const openFilesContext: OpenFileContext[] = []
    allOpenedFileIds.forEach(id => {
      const file = files.find(f => f.path === id)
      if (file && typeof file.content === 'string') {
        openFilesContext.push({
          path: file.path,
          content: file.content
        })
      }
    })

    return openFilesContext
  }

  const revertToMessage = async (id: string): Promise<string | null> => {
    const idx = messages.findIndex(m => m.id === id)
    if (idx === -1) return null

    const messageToEdit = messages[idx]
    const updatedMessages = messages.slice(0, idx)
    setMessages(updatedMessages)

    const title =
      conversations.find(c => c.id === activeConversationId)?.title ||
      'New Chat'
    await saveConversation(activeConversationId, title, updatedMessages)
    loadConversations(activeConversationId)

    return messageToEdit.text
  }

  const sendMessage = async (text: string, mentionedFiles: string[] = []) => {
    const activeApiKey =
      apiKey || (user ? process.env.NEXT_PUBLIC_DEFAULT_GEMINI_API_KEY : '')
    if (!text.trim() || !activeApiKey) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsLoading(true)

    // Determine title for new conversation
    const title =
      messages.length === 0
        ? text.slice(0, 30) + '...'
        : conversations.find(c => c.id === activeConversationId)?.title ||
          'New Chat'

    try {
      const openFiles = getOpenFiles()
      const aiResponse = await generateChatResponse(
        activeApiKey,
        model,
        newMessages.map(m => ({ role: m.role as any, text: m.text })),
        openFiles,
        files,
        mentionedFiles
      )

      if (aiResponse && aiResponse.text) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: aiResponse.text,
          timestamp: Date.now(),
          toolCalls: aiResponse.toolCalls,
          tokenUsage: aiResponse.tokenUsage
        }
        const updatedMessages = [...newMessages, aiMsg]
        setMessages(updatedMessages)
        await saveConversation(activeConversationId, title, updatedMessages)
        loadConversations(activeConversationId) // Refresh list
      }
    } catch (err: any) {
      console.error(err)

      let errorMsgText = 'Error generating response. Please check your API key.'
      if (err?.message?.includes('429') || err?.status === 429) {
        errorMsgText =
          'API rate limit reached. Please wait a moment and try again.'
        toast.error(
          'AI API Rate Limit Reached! Please wait before sending more messages.'
        )
      } else {
        toast.error(`Chat Error: ${err.message || 'Unknown error occurred'}`)
      }

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: errorMsgText,
        timestamp: Date.now()
      }
      const updatedMessages = [...newMessages, errorMsg]
      setMessages(updatedMessages)
      await saveConversation(activeConversationId, title, updatedMessages)
      loadConversations(activeConversationId)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        messages,
        apiKey,
        setApiKey: handleSetApiKey,
        model,
        setModel: handleSetModel,
        sendMessage,
        revertToMessage,
        createNewConversation,
        switchConversation,
        deleteConversation,
        isLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
