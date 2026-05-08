import { useContext, useState, useRef, useEffect, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatContext } from '../../contexts/ChatContext'
import { FileContext } from '../../contexts/FileContext'
import { FileViewsContext } from '../../contexts/FileViewContext'
import Icon from 'src/components/Core/Icons'
import { useL0g1n } from 'l0g1n-sdk'
import { useExtension } from 'src/hooks/useExtension'
import { toast } from 'sonner'


import {
  Container,
  Header,
  Controls,
  ApiKeyInput,
  MessageList,
  MessageBubble,
  InputContainer,
  ToolActionList,
  ToolBadge,
  TokenBadge,
  MentionPopup,
  MentionItem,
  ConversationSelect,
  UserProfileBadge,
  Footer
} from './styled'

const AgentManager: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    messages,
    apiKey,
    setApiKey,
    model,
    setModel,
    sendMessage,
    revertToMessage,
    createNewConversation,
    switchConversation,
    deleteConversation,
    isLoading
  } = useContext(ChatContext)

  const { files, setFocusedFile } = useContext(FileContext)
  const { openFile, getRootId } = useContext(FileViewsContext)
  const { user, signInWithGithub, signInWithGoogle, logOut } = useL0g1n()
  const { extractIcon } = useExtension()

  const [input, setInput] = useState('')
  const [tempKey, setTempKey] = useState('')
  const [mentionedFiles, setMentionedFiles] = useState<string[]>([])
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionIndex, setMentionIndex] = useState(-1)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filteredFiles = files
    .filter(f => f.path.toLowerCase().includes(mentionQuery.toLowerCase()))
    .slice(0, 10)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInput(val)

    // Check if we are typing a mention
    const match = val.match(/(?:^|\s)@(\S*)$/)
    if (match) {
      setMentionQuery(match[1])
      setShowMentions(true)
      setMentionIndex(0)
    } else {
      setShowMentions(false)
    }
  }

  const handleSelectMention = (path: string) => {
    const newVal = input.replace(/(?:^|\s)@\S*$/, ` @${path} `)
    setInput(newVal)
    setShowMentions(false)
    if (!mentionedFiles.includes(path)) {
      setMentionedFiles([...mentionedFiles, path])
    }
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showMentions && filteredFiles.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMentionIndex(prev => (prev + 1) % filteredFiles.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setMentionIndex(
          prev => (prev - 1 + filteredFiles.length) % filteredFiles.length
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelectMention(filteredFiles[mentionIndex].path)
      } else if (e.key === 'Escape') {
        setShowMentions(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const text = input
    setInput('')
    setShowMentions(false)

    // Extract actual mentioned files that are present in the text
    const activeMentions = mentionedFiles.filter(path =>
      text.includes(`@${path}`)
    )
    await sendMessage(text, activeMentions)
  }

  const handleEditMessage = async (id: string) => {
    if (isLoading) return
    const textToEdit = await revertToMessage(id)
    if (textToEdit) {
      setInput(textToEdit)
      inputRef.current?.focus()
    }
  }

  const handleOpenFile = (path: string) => {
    setFocusedFile(path)
    openFile(path, getRootId())
  }

  if (!user) {
    return (
      <Container id="ai-agent-tour">
        <Header>
          <h3>AI Agent</h3>
        </Header>
        <ApiKeyInput>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', margin: '0 0 10px 0', lineHeight: 1.4 }}>
              <strong>Login to unlock AI Chat</strong>
              <br />
              Log in with GitHub or Google to access the AI agent.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={async () => {
                  try {
                    await signInWithGithub()
                  } catch (err: any) {
                    toast.error(err.message || 'Failed to login with GitHub')
                  }
                }}
                style={{ flex: 1, padding: '8px', cursor: 'pointer' }}
              >
                GitHub Login
              </button>
              <button
                onClick={async () => {
                  try {
                    await signInWithGoogle()
                  } catch (err: any) {
                    toast.error(err.message || 'Failed to login with Google')
                  }
                }}
                style={{ flex: 1, padding: '8px', cursor: 'pointer' }}
              >
                Google Login
              </button>
            </div>
          </div>
        </ApiKeyInput>
      </Container>
    )
  }

  const defaultApiKey = process.env.NEXT_PUBLIC_DEFAULT_GEMINI_API_KEY
  const hasActiveKey = apiKey || defaultApiKey

  if (!hasActiveKey) {
    return (
      <Container id="ai-agent-tour">
        <Header>
          <h3>AI Agent</h3>
        </Header>
        <ApiKeyInput>
          <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
            <strong>Welcome! Provide your Gemini API Key</strong>
            <br />
            Stored exclusively in your browser's local storage and sent directly to Google's API.
            <br />
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'var(--primary-color, #00ff00)',
                textDecoration: 'underline',
                marginTop: '4px',
                display: 'inline-block'
              }}
            >
              Get your API Key from Google
            </a>
          </p>
          <input
            type="password"
            placeholder="AIza..."
            value={tempKey}
            onChange={e => setTempKey(e.target.value)}
            style={{ marginTop: '10px' }}
          />
          <button onClick={() => setApiKey(tempKey)} style={{ marginTop: '10px' }}>Save Key</button>
        </ApiKeyInput>
      </Container>
    )
  }

  return (
    <Container id="ai-agent-tour">
      <Header>
        <ConversationSelect
          value={activeConversationId}
          onChange={e => switchConversation(e.target.value)}
          title="Select Conversation"
        >
          {conversations.map(c => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
          {conversations.length === 0 && (
            <option value="default">New Chat</option>
          )}
        </ConversationSelect>
        <Controls>
          <button onClick={createNewConversation} title="New Chat">
            +
          </button>
          <button
            onClick={() => deleteConversation(activeConversationId)}
            title="Delete Current Chat"
            style={{ color: '#ff4444' }}
          >
            Del
          </button>
        </Controls>
      </Header>

      <MessageList>
        {messages.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              opacity: 0.5,
              fontSize: '13px',
              marginTop: '20px'
            }}
          >
            Ask me anything about the codebase. Type @ to mention specific
            files.
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              marginBottom: '8px'
            }}
          >
            <MessageBubble isUser={msg.role === 'user'}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>

              {msg.role !== 'user' && msg.toolCalls && msg.toolCalls.length > 0 && (
                <ToolActionList>
                  {msg.toolCalls.map((tc, idx) =>
                    tc.readFiles && tc.readFiles.length > 0 ? (
                      tc.readFiles.map((file, fIdx) => {
                        const FileIcon = extractIcon(file, false, false)
                        return (
                          <ToolBadge
                            key={`${idx}-${fIdx}`}
                            clickable
                            onClick={() => handleOpenFile(file)}
                            title={`Open ${file}`}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                marginRight: '6px'
                              }}
                            >
                              <FileIcon width="14px" height="14px" />
                            </span>
                            Read: {file}
                          </ToolBadge>
                        )
                      })
                    ) : (
                      <ToolBadge key={idx}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            marginRight: '6px'
                          }}
                        >
                          <Icon variant="settings" width="14px" height="14px" />
                        </span>
                        {tc.resultSummary || `Used tool: ${tc.name}`}
                      </ToolBadge>
                    )
                  )}
                </ToolActionList>
              )}

              {msg.tokenUsage && (
                <TokenBadge>
                  ⚡ {msg.tokenUsage.prompt + msg.tokenUsage.completion} tokens
                </TokenBadge>
              )}
            </MessageBubble>
            {msg.role === 'user' && (
              <div
                onClick={() => handleEditMessage(msg.id)}
                style={{
                  fontSize: '11px',
                  color: 'var(--tile-border, #666)',
                  cursor: 'pointer',
                  marginTop: '6px',
                  paddingRight: '8px',
                  opacity: 0.6,
                  alignSelf: 'flex-end',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.textDecoration = 'underline'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '0.6'
                  e.currentTarget.style.textDecoration = 'none'
                }}
              >
                ✎ Edit
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <MessageBubble isUser={false}>
            <span style={{ opacity: 0.5 }}>Thinking...</span>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessageList>

      <div style={{ position: 'relative' }}>
        {showMentions && filteredFiles.length > 0 && (
          <MentionPopup>
            {filteredFiles.map((f, i) => (
              <MentionItem
                key={f.path}
                active={i === mentionIndex}
                onClick={() => handleSelectMention(f.path)}
                onMouseEnter={() => setMentionIndex(i)}
              >
                {f.path}
              </MentionItem>
            ))}
          </MentionPopup>
        )}
        <InputContainer onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask something... (Type @ to attach files)"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
          />
          <button type="submit" disabled={isLoading || !input.trim()} title="Send Message" style={{ color: '#fff' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16px" height="16px">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </InputContainer>
        <Footer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6, fontSize: '11px', flexShrink: 0 }}>
            <span>+</span>
            <select value={model} onChange={e => setModel(e.target.value)} style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer', outline: 'none', fontFamily: 'monospace' }}>
              <option value="gemini-flash-latest">Gemini Flash</option>
              <option value="gemini-pro-latest">Gemini Pro</option>
              <option value="gemini-flash-lite-latest">Gemini Flash Lite</option>
            </select>
          </div>
          {user && (
            <UserProfileBadge title={user.email || 'Logged In'}>
              {user.photoURL && <img src={user.photoURL} alt="Avatar" />}
              <span>{user.displayName || user.email?.split('@')[0] || 'User'}</span>
              <div
                onClick={logOut}
                title="Logout"
                style={{ 
                  cursor: 'pointer', 
                  backgroundColor: '#ff4444',
                  color: '#ffffff',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginLeft: 'auto',
                  flexShrink: 0,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12px" height="12px">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
              </div>
            </UserProfileBadge>
          )}
        </Footer>
      </div>
    </Container>
  )
}

export default AgentManager
