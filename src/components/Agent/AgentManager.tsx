import { useContext, useState, useRef, useEffect, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatContext } from '../../contexts/ChatContext'
import { FileContext } from '../../contexts/FileContext'
import { FileViewsContext } from '../../contexts/FileViewContext'
import Icon from 'src/components/Core/Icons'
import { useL0g1n } from 'l0g1n-sdk'

import { useExtension } from 'src/hooks/useExtension'

import {
  Container,
  Header,
  Controls,
  MessageList,
  MessageBubble,
  InputContainer,
  ToolActionList,
  ToolBadge,
  TokenBadge,
  MentionPopup,
  MentionItem,
  ModelSelect,
  UserProfileBadge,
  Footer,
  DropdownTrigger,
  DropdownPopup,
  DropdownInput,
  DropdownOption
} from './styled'

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select...'
}: {
  options: { id: string; title: string }[]
  value: string
  onChange: (val: string) => void
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = options.find(o => o.id === value)
  const filtered = options.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', flex: 1, marginRight: '12px' }}
    >
      <DropdownTrigger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {selected?.title || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          fill="currentColor"
          viewBox="0 0 16 16"
          style={{
            marginLeft: '8px',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s'
          }}
        >
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </DropdownTrigger>

      {isOpen && (
        <DropdownPopup>
          <div
            style={{
              padding: '6px',
              borderBottom: `1px solid var(--tile-border, #ccc)`
            }}
          >
            <DropdownInput
              ref={inputRef}
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ overflowY: 'auto' }}>
            {filtered.length > 0 ? (
              filtered.map(o => (
                <DropdownOption
                  key={o.id}
                  active={o.id === value}
                  onClick={() => {
                    onChange(o.id)
                    setIsOpen(false)
                    setSearch('')
                  }}
                >
                  {o.title}
                </DropdownOption>
              ))
            ) : (
              <div
                style={{
                  padding: '8px 10px',
                  fontSize: '12px',
                  color: '#666',
                  fontFamily: 'monospace'
                }}
              >
                No chats found
              </div>
            )}
          </div>
        </DropdownPopup>
      )}
    </div>
  )
}

interface AgentManagerProps {
  onClose?: () => void
}

const AgentManager: React.FC<AgentManagerProps> = ({ onClose }) => {
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
  const { user, logOut } = useL0g1n()
  const { extractIcon } = useExtension()

  const [input, setInput] = useState('')
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

  const renderContent = () => {
    const defaultApiKey = process.env.NEXT_PUBLIC_DEFAULT_GEMINI_API_KEY
    const hasActiveKey = apiKey || defaultApiKey

    if (!hasActiveKey) {
      return (
        <Container id="ai-agent-tour">
          <Header>
            <h3 style={{ margin: 0, paddingLeft: '8px' }}>AI Agent</h3>
            <Controls>
              {onClose && (
                <button onClick={onClose} title="Close Chat">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </Controls>
          </Header>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: '16px', opacity: 0.5 }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h3 style={{ marginBottom: '8px' }}>API Key Required</h3>
            <p style={{ marginBottom: '24px', opacity: 0.8, fontSize: '13px' }}>
              You need to configure a Gemini API Key to access the AI Agent
              chat.
            </p>
            <button
              onClick={() => {
                const key = prompt('Enter your Gemini API Key:')
                if (key) setApiKey(key)
              }}
              style={{
                padding: '10px 20px',
                background: '#007acc',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}
            >
              Set API Key
            </button>
          </div>
        </Container>
      )
    }

    return (
      <Container id="ai-agent-tour">
        <Header>
          <SearchableDropdown
            options={
              conversations.length > 0
                ? conversations.map(c => ({ id: c.id, title: c.title }))
                : [{ id: 'default', title: 'New Chat' }]
            }
            value={activeConversationId || 'default'}
            onChange={val => switchConversation(val)}
            placeholder="Select Conversation"
          />
          <Controls>
            <button onClick={createNewConversation} title="New Chat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button
              onClick={() => deleteConversation(activeConversationId)}
              title="Delete Current Chat"
              style={{ color: '#ff4444' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            {onClose && (
              <button onClick={onClose} title="Close Chat">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
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

                {msg.role !== 'user' &&
                  msg.toolCalls &&
                  msg.toolCalls.length > 0 && (
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
                              <Icon
                                variant="settings"
                                width="14px"
                                height="14px"
                              />
                            </span>
                            {tc.resultSummary || `Used tool: ${tc.name}`}
                          </ToolBadge>
                        )
                      )}
                    </ToolActionList>
                  )}

                {msg.tokenUsage && (
                  <TokenBadge>
                    ⚡ {msg.tokenUsage.prompt + msg.tokenUsage.completion}{' '}
                    tokens
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
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              title="Send Message"
              style={{ color: '#fff' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="16px"
                height="16px"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </InputContainer>
          <Footer>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                opacity: 0.6,
                fontSize: '11px',
                flexShrink: 0
              }}
            >
              <span>+</span>
              <ModelSelect
                value={model}
                onChange={e => setModel(e.target.value)}
              >
                <option value="gemini-flash-latest">Gemini Flash</option>
                <option value="gemini-pro-latest">Gemini Pro</option>
                <option value="gemini-flash-lite-latest">
                  Gemini Flash Lite
                </option>
              </ModelSelect>
            </div>
            {user && (
              <UserProfileBadge title={user.email || 'Logged In'}>
                {user.photoURL && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt="Avatar" />
                )}
                <span>
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
                <div
                  onClick={async () => {
                    await logOut()
                    localStorage.removeItem('GIG_GITHUB_TOKEN')
                  }}
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
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="12px"
                    height="12px"
                  >
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

  return renderContent()
}

export default AgentManager
