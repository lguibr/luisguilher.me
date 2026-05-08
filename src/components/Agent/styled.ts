import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.menuBackground};
  color: ${({ theme }) => theme.colors.text};
  border-left: 1px solid ${({ theme }) => theme.colors.tileBorder};
  font-family: 'Inter', sans-serif;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.tileBorder};
  background: ${({ theme }) => theme.colors.menuBackground};

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
`

export const Controls = styled.div`
  display: flex;
  gap: 8px;

  select {
    appearance: none;
    background-color: ${({ theme }) => theme.colors.editorBackground};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.tileBorder};
    border-radius: 0px;
    padding: 4px 24px 4px 8px;
    font-size: 12px;
    font-family: 'Inter', monospace;
    outline: none;
    cursor: pointer;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 8px top 50%;
    background-size: 8px auto;

    &:focus {
      border-color: ${({ theme }) => theme.colors.accentColor};
    }

    option {
      background: ${({ theme }) => theme.colors.editorBackground};
      color: ${({ theme }) => theme.colors.text};
    }
  }

  button {
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.tileBorder};
    border-radius: 0px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.negativeHighlight};
      border-color: ${({ theme }) => theme.colors.negativeHighlight};
    }
  }
`

export const ApiKeyInput = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  a {
    color: ${({ theme }) => theme.colors.accentColor || '#00ff00'};
    text-decoration: underline;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  input {
    background: ${({ theme }) => theme.colors.editorBackground};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.tileBorder};
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 13px;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.accentColor};
    }
  }

  button {
    background: ${({ theme }) => theme.colors.accentColor};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
`

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.tileBorder};
    border-radius: 3px;
  }
`

export const MessageBubble = styled.div<{ isUser: boolean }>`
  width: 100%;
  padding: ${({ isUser }) => (isUser ? '16px 20px' : '16px 0')};
  border-radius: ${({ isUser }) => (isUser ? '16px' : '0px')};
  font-family: 'Inter', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: ${({ isUser, theme }) =>
    isUser ? theme.colors.editorBackground : 'transparent'};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  box-shadow: none;
  position: relative;
`

export const InputContainer = styled.form`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.editorBackground};
  border: 1px solid ${({ theme }) => theme.colors.tileBorder};
  border-radius: 24px;
  padding: 4px 8px;
  margin: 16px 16px 8px 16px;

  input {
    flex: 1;
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: none;
    padding: 8px 12px;
    font-size: 13px;
    outline: none;

    &:focus,
    &:active {
      outline: none !important;
      box-shadow: none !important;
    }
  }

  button {
    background: #007acc; /* Always blue */
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    margin-right: 4px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }

    &:disabled {
      background: ${({ theme }) => theme.colors.tileBorder};
      opacity: 1;
      cursor: not-allowed;
    }
  }
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 16px 16px 16px;
  gap: 16px;
`

export const ToolActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
`

export const ToolBadge = styled.div<{ clickable?: boolean }>`
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.tileBorder};
  border-radius: 0px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  width: fit-content;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: all 0.2s;

  ${({ clickable, theme }) =>
    clickable &&
    `
    &:hover {
      opacity: 1;
      border-color: ${theme.colors.accentColor};
      color: ${theme.colors.accentColor};
    }
  `}

  span {
    font-weight: normal;
    margin-right: 6px;
  }
`

export const TokenBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 10px;
  opacity: 0.5;
  margin-top: 6px;
  gap: 4px;
`

export const MentionPopup = styled.div`
  position: absolute;
  bottom: 100%;
  left: 16px;
  background: ${({ theme }) => theme.colors.menuBackground};
  border: 1px solid ${({ theme }) => theme.colors.tileBorder};
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  width: calc(100% - 32px);
  z-index: 10;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
`

export const MentionItem = styled.div<{ active?: boolean }>`
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  background: ${({ active, theme }) =>
    active ? theme.colors.editorBackground : 'transparent'};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: ${({ theme }) => theme.colors.editorBackground};
  }
`

export const ConversationSelect = styled.select`
  appearance: none;
  background-color: ${({ theme }) => theme.colors.editorBackground};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.tileBorder};
  border-radius: 0px;
  font-size: 13px;
  font-family: 'Inter', monospace;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  padding: 6px 28px 6px 12px;
  max-width: 180px;
  text-overflow: ellipsis;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  background-size: 10px auto;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accentColor};
  }

  option {
    background: ${({ theme }) => theme.colors.editorBackground};
    color: ${({ theme }) => theme.colors.text};
    padding: 8px;
  }
`

export const UserProfileBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  background: transparent;
  font-family: 'Inter', monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  flex: 1;
  min-width: 0;

  img {
    width: 14px;
    height: 14px;
    border-radius: 50%; /* standard avatar */
    object-fit: cover;
    flex-shrink: 0;
  }

  span {
    font-weight: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button {
    background: transparent;
    color: ${({ theme }) => theme.colors.negativeHighlight || '#ff4444'};
    border: none;
    font-size: 10px;
    font-family: 'Inter', monospace;
    cursor: pointer;
    margin-left: 4px;
    padding: 2px 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`
