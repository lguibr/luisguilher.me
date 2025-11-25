// File: src/components/Core/MarkdownPreview/index.tsx
import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import mermaid from 'mermaid'
import { MarkdownContainer } from './styled'
import { useTheme } from 'styled-components'

interface MarkdownPreviewProps {
  markdown: string
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const mermaidInitialized = useRef(false)

  useEffect(() => {
    // Initialize Mermaid only once when the component mounts
    if (!mermaidInitialized.current) {
      try {
        if (typeof window !== 'undefined') {
          mermaid.initialize({
            startOnLoad: false,
            theme:
              theme.colors.editorBackground === '#FFFFFF' ? 'default' : 'dark',
            securityLevel: 'loose'
          })
          mermaidInitialized.current = true
        }
      } catch (e) {
        console.error('[MarkdownPreview] Failed to initialize Mermaid:', e)
      }
    }

    // Update Mermaid theme if app theme changes
    if (mermaidInitialized.current) {
      try {
        mermaid.initialize({
          theme:
            theme.colors.editorBackground === '#FFFFFF' ? 'default' : 'dark'
        })
      } catch (e) {
        console.error('[MarkdownPreview] Failed to update Mermaid theme:', e)
      }
    }

    // Run Mermaid on the current content
    if (mermaidInitialized.current && containerRef.current) {
      try {
        const timer = setTimeout(() => {
          if (containerRef.current) {
            const mermaidElements =
              containerRef.current.querySelectorAll('.language-mermaid')
            if (mermaidElements.length > 0) {
              mermaid.init(undefined, mermaidElements as NodeListOf<HTMLElement>)
            }
          }
        }, 100)

        return () => clearTimeout(timer)
      } catch (e) {
        console.error('[MarkdownPreview] Error running Mermaid:', e)
      }
    }
  }, [markdown, theme])

  return (
    <MarkdownContainer ref={containerRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {markdown}
      </ReactMarkdown>
    </MarkdownContainer>
  )
}

export default MarkdownPreview
