import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  /* Modern CSS Reset & Smooth Behavior */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Beautiful Custom Scrollbars */
  * {
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: #3f3f46;
      border-radius: 5px;
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: all 0.3s ease;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #52525b;
      border-radius: 5px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }

    ::-webkit-scrollbar-thumb:active {
      background: #71717a;
    }

    /* Firefox Scrollbar */
    scrollbar-width: thin;
    scrollbar-color: #3f3f46 transparent;
  }

  /* Body with Modern Typography */
  body {
    color: #fafafa;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    overflow: hidden;
    min-height: 100dvh;
    background: #0f1115;
    letter-spacing: 0;
  }

  /* Typography Hierarchy */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.2;
    color: #ffffff;
  }

  code, pre, .monaco-editor {
    font-family: 'JetBrains Mono', 'Monaco', 'Courier New', monospace !important;
    font-variant-ligatures: common-ligatures;
    font-feature-settings: "liga" 1, "calt" 1;
  }

  /* Smooth Transitions */
  a, button, input, select, textarea {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Focus States */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #0070f3;
    outline-offset: 2px;
  }

  /* Selection */
  ::selection {
    background: rgba(0, 112, 243, 0.3);
    color: #ffffff;
  }

  /* Global Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(0, 112, 243, 0.2);
    }
    50% {
      box-shadow: 0 0 15px rgba(0, 112, 243, 0.4), 0 0 30px rgba(0, 112, 243, 0.2);
    }
  }
  @media print {
    body * {
      visibility: hidden;
    }
    #printable-content, #printable-content * {
      visibility: visible;
    }
    #printable-content {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`
