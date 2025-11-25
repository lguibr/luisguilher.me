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
      width: 12px;
      height: 12px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 6px;
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: all 0.3s ease;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #7c8ff0 0%, #8a5db0 100%);
      border-radius: 6px;
      border: 2px solid transparent;
      background-clip: padding-box;
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }

    ::-webkit-scrollbar-thumb:active {
      background: linear-gradient(135deg, #5568d3 0%, #5f3d8a 100%);
    }

    /* Firefox Scrollbar */
    scrollbar-width: thin;
    scrollbar-color: #667eea transparent;
  }

  /* Body with Modern Typography */
  body {
    color: #E2E8F0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    overflow: hidden;
    min-height: 100vh;
    background: #0f0c29;
    letter-spacing: -0.01em;
  }

  /* Typography Hierarchy */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', 'Inter', sans-serif;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  code, pre, .monaco-editor {
    font-family: 'JetBrains Mono', 'Monaco', 'Courier New', monospace !important;
    font-variant-ligatures: common-ligatures;
    font-feature-settings: "liga" 1, "calt" 1;
  }

  /* Smooth Transitions */
  a, button, input, select, textarea {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Focus States */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  /* Selection */
  ::selection {
    background: rgba(102, 126, 234, 0.3);
    color: #F8FAFC;
  }

  /* Global Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
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
      opacity: 0.5;
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
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 40px rgba(118, 75, 162, 0.4);
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
