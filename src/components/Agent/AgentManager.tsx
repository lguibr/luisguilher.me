import { useContext, useState, useRef, useEffect, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatContext } from '../../contexts/ChatContext'
import { FileContext } from '../../contexts/FileContext'
import { FileViewsContext } from '../../contexts/FileViewContext'
import Icon from 'src/components/Core/Icons'
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
  ConversationSelect
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
    createNewConversation,
    switchConversation,
    deleteConversation,
    isLoading
  } = useContext(ChatContext)

  const { files, setFocusedFile } = useContext(FileContext)
  const { openFile, getRootId } = useContext(FileViewsContext)

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

  const handleOpenFile = (path: string) => {
    setFocusedFile(path)
    openFile(path, getRootId())
  }

  if (!apiKey) {
    return (
      <Container id="ai-agent-tour">
        <Header>
          <h3>AI Agent</h3>
        </Header>
        <ApiKeyInput>
          <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
            Please enter your Gemini API key to start chatting.
            <br />
            <strong>Security Note:</strong> We do not save your key. It is
            stored exclusively in your own browser&apos;s local storage and is
            sent directly to Google&apos;s API, never to our servers.
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
          />
          <button onClick={() => setApiKey(tempKey)}>Save Key</button>
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
          <select value={model} onChange={e => setModel(e.target.value)}>
            <option value="gemini-flash-latest">Flash</option>
            <option value="gemini-pro-latest">Pro</option>
            <option value="gemini-flash-lite-latest">Flash Lite</option>
          </select>
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
          <MessageBubble key={index} isUser={msg.role === 'user'}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text}
            </ReactMarkdown>

            {msg.role !== 'user' && msg.toolCalls && msg.toolCalls.length > 0 && (
              <ToolActionList>
                {msg.toolCalls.map((tc, idx) =>
                  tc.readFiles && tc.readFiles.length > 0 ? (
                    tc.readFiles.map((file, fIdx) => (
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
                          <Icon variant="file" width="14px" height="14px" />
                        </span>
                        Read: {file.split('/').pop() || file}
                      </ToolBadge>
                    ))
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
          <button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </button>
        </InputContainer>
      </div>
    </Container>
  )
}

export default AgentManager
