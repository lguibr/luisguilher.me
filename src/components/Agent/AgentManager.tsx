import { useContext, useState, useRef, useEffect, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatContext } from '../../contexts/ChatContext'
import { FileContext } from '../../contexts/FileContext'
import { FileViewsContext } from '../../contexts/FileViewContext'
import Icon from 'src/components/Core/Icons'
import { useL0g1n } from 'l0g1n-sdk'
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth'

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
  ModelSelect,
  UserProfileBadge,
  Footer
} from './styled'

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
  const { user, signInWithGithub, signInWithGoogle, logOut, auth } = useL0g1n()
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

  const renderContent = () => {
    if (!user) {
      return (
        <Container id="ai-agent-tour">
          <Header>
            <h3>AI Agent</h3>
            <Controls>
              {onClose && (
                <button onClick={onClose} title="Close Chat">
                  X
                </button>
              )}
            </Controls>
          </Header>
          <ApiKeyInput>
            <div style={{ marginBottom: '20px' }}>
              <p
                style={{
                  fontSize: '13px',
                  margin: '0 0 10px 0',
                  lineHeight: 1.4
                }}
              >
                <strong>Login to unlock AI Chat</strong>
                <br />
                Log in with GitHub or Google to access the AI agent.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={async () => {
                    if (!auth) return
                    try {
                      const provider = new GithubAuthProvider()
                      // provider.addScope('repo')
                      const result = await signInWithPopup(auth, provider)

                      const credential =
                        GithubAuthProvider.credentialFromResult(result)
                      if (credential?.accessToken) {
                        localStorage.setItem(
                          'GIG_GITHUB_TOKEN',
                          credential.accessToken
                        )
                        window.location.reload()
                      }
                    } catch (err: unknown) {
                      console.error('[AgentManager] GitHub Login Error:', err)
                      signInWithGithub() // Fallback
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: '1px solid #333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.backgroundColor = '#1a1a1a')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.backgroundColor = '#000000')
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  GitHub
                </button>
                <button
                  onClick={async () => {
                    try {
                      await signInWithGoogle()
                    } catch (err: unknown) {
                      toast.error(
                        (err as Error).message || 'Failed to login with Google'
                      )
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: '#4285F4',
                    color: '#ffffff',
                    border: '1px solid #4285F4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.backgroundColor = '#3367d6')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.backgroundColor = '#4285F4')
                  }
                >
                  <div
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '2px',
                      padding: '2px',
                      display: 'flex'
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="12"
                      height="12"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                  </div>
                  Google
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
            <Controls>
              {onClose && (
                <button onClick={onClose} title="Close Chat">
                  X
                </button>
              )}
            </Controls>
          </Header>
          <ApiKeyInput>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
              <strong>Welcome! Provide your Gemini API Key</strong>
              <br />
              Stored exclusively in your browser&apos;s local storage and sent
              directly to Google&apos;s API.
              <br />
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#007acc',
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
            <button
              onClick={() => setApiKey(tempKey)}
              style={{ marginTop: '10px' }}
            >
              Save Key
            </button>
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
            {onClose && (
              <button onClick={onClose} title="Close Chat">
                X
              </button>
            )}
          </Controls>
        </Header>
        {typeof window !== 'undefined' &&
          !localStorage.getItem('GIG_GITHUB_TOKEN') && (
            <button
              onClick={async () => {
                if (auth) {
                  try {
                    const provider = new GithubAuthProvider()
                    // provider.addScope('repo')
                    const result = await signInWithPopup(auth, provider)
                    console.log(
                      '[AgentManager] GitHub Connection Result:',
                      result
                    )
                    const credential =
                      GithubAuthProvider.credentialFromResult(result)
                    console.log('[AgentManager] GitHub Credential:', credential)
                    if (credential?.accessToken) {
                      localStorage.setItem(
                        'GIG_GITHUB_TOKEN',
                        credential.accessToken
                      )
                      console.log(
                        '[AgentManager] GIG_GITHUB_TOKEN saved to localStorage'
                      )
                      window.location.reload()
                    } else {
                      console.warn(
                        '[AgentManager] No accessToken found in credential'
                      )
                    }
                  } catch (error: unknown) {
                    console.error('[AgentManager] GitHub Auth Error:', error)
                    toast.error(
                      `Auth failed: ${
                        (error as Error).message || 'Unknown error'
                      }`
                    )
                  }
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#252526',
                borderBottom: '1px solid #333',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                fontSize: '12px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.backgroundColor = '#2d2d30')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.backgroundColor = '#252526')
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>Connect with GitHub</span>
              <span style={{ color: '#4daafc' }}>
                (to increase rate limits)
              </span>
            </button>
          )}

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
