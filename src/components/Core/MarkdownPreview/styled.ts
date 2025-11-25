import styled from 'styled-components'
import { animations } from 'src/styles/animations'

export const MarkdownContainer = styled.div`
  padding: 32px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.editorBackground};
  font-size: 13px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  ${animations.fadeIn}

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.fileLine};
    border-radius: 5px;
    border: 2px solid ${({ theme }) => theme.colors.editorBackground};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.subString};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    font-weight: 600;
    line-height: 1.3;
    border-bottom: 1px solid ${({ theme }) => theme.colors.fileLine};
    padding-bottom: 0.3em;
    color: ${({ theme }) => theme.colors.text};
  }

  h1 {
    font-size: 2em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.fileLine};
    margin-bottom: 1em;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.25em;
  }

  p {
    margin-bottom: 1em;
    font-size: 1em;
  }

  a {
    color: ${({ theme }) => theme.colors.accentSecondary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  code {
    font-family: 'Fira Code', 'Courier New', monospace;
    background-color: ${({ theme }) => theme.colors.sideHighlight};
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.text};
  }

  pre {
    background-color: ${({ theme }) => theme.colors.menuBackground};
    padding: 16px;
    overflow: auto;
    font-size: 90%;
    line-height: 1.5;
    border-radius: 6px;
    margin-bottom: 1.5em;
    border: 1px solid ${({ theme }) => theme.colors.fileLine};

    code {
      background-color: transparent;
      padding: 0;
      margin: 0;
      font-size: 100%;
      border-radius: 0;
      display: inline;
      line-height: inherit;
      color: inherit;
    }
  }

  blockquote {
    margin: 0 0 1.5em 0;
    padding: 0.5em 1em;
    color: ${({ theme }) => theme.colors.subString};
    border-left: 4px solid ${({ theme }) => theme.colors.fileLine};
    background: transparent;
    font-style: italic;
  }

  ul,
  ol {
    margin-left: 2em;
    margin-bottom: 1em;
  }

  li {
    margin-bottom: 0.5em;
  }

  table {
    border-collapse: collapse;
    margin-bottom: 1.5em;
    display: block;
    width: max-content;
    max-width: 100%;
    overflow: auto;
  }

  th,
  td {
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => theme.colors.fileLine};
  }

  th {
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.sideHighlight};
    text-align: left;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5em auto;
  }

  hr {
    border: 0;
    height: 1px;
    padding: 0;
    margin: 24px 0;
    background: ${({ theme }) => theme.colors.fileLine};
  }

  /* Mermaid diagram styling */
  .mermaid {
    display: block;
    margin-bottom: 2em;
    text-align: center;
    padding: 10px;
    background: transparent;

    svg {
      max-width: 100% !important;
      height: auto !important;
    }
  }
`
