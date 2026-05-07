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
    background: ${({ theme }) => theme.colors.editorBackground};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.tileBorder};
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: ${({ theme }) => theme.colors.accentColor};
    }
  }

  button {
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.tileBorder};
    border-radius: 4px;
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
  padding: 16px;
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
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 2px;
  font-family: 'Inter', monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: ${({ isUser, theme }) =>
    isUser ? theme.colors.menuBackground : theme.colors.editorBackground};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.tileBorder};

  box-shadow: none;
`

export const InputContainer = styled.form`
  display: flex;
  padding: 16px;
  background: ${({ theme }) => theme.colors.menuBackground};
  border-top: 1px solid ${({ theme }) => theme.colors.tileBorder};

  input {
    flex: 1;
    background: ${({ theme }) => theme.colors.editorBackground};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.tileBorder};
    border-radius: 2px;
    padding: 10px 16px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.accentColor};
    }
  }

  button {
    background: transparent;
    color: ${({ theme }) => theme.colors.accentColor};
    border: none;
    padding: 0 16px;
    cursor: pointer;
    font-weight: 600;

    &:disabled {
      color: ${({ theme }) => theme.colors.tileBorder};
      cursor: not-allowed;
    }
  }
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
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: none;
  font-size: 14px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  max-width: 150px;
  text-overflow: ellipsis;

  option {
    background: ${({ theme }) => theme.colors.menuBackground};
  }
`
