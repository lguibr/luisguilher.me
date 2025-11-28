import useWindow from 'src/hooks/useWindow'
import useContextTheme from 'src/hooks/useContextTheme'
import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { defineMonacoThemes } from 'src/styles/monaco'

import { useMemo, useCallback, useRef } from 'react'

type EditorProps = {
  currentExt: string
  currentContent: string
  onChange: (value?: string | undefined) => void
}

const LoadingEditor = () => {
  return <div></div>
}

const Editor: React.FC<EditorProps> = ({
  currentExt,
  currentContent,
  onChange
}) => {
  const editorRef = useRef(null)

  const { selectedTheme } = useContextTheme()
  const { isMedium } = useWindow()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = useCallback(
    (monaco: Monaco, editor: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tsLanguages = monaco.languages.typescript as any
      tsLanguages.typescriptDefaults.setCompilerOptions({
        noLib: true,
        allowNonTsExtensions: true
      })

      editorRef.current = editor

      tsLanguages.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
        onlyVisible: true
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jsonLanguages = monaco.languages.json as any
      jsonLanguages.jsonDefaults.setDiagnosticsOptions({
        comments: 'ignore'
      })

      // Force layout calculation after a short delay to ensure container is stable
      setTimeout(() => {
        editor.layout()
      }, 100)
    },
    [editorRef]
  )

  const options = useMemo(() => {
    const agnosticConfig = {
      quickSuggestions: false,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible'
      },
      fixedOverflowWidgets: true
    }

    const hideLineNumberOptions = {
      lineNumbers: 'off',
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      ...agnosticConfig,
      wordWrap: 'on',
      fontSize: '12px',
      tabSize: 1,
      minimap: {
        enabled: false
      }
    } as const

    const showLineNumberOptions = {
      lineNumbers: 'on',
      glyphMargin: true,
      wordWrap: 'on',
      folding: true,
      ...agnosticConfig,
      minimap: {
        enabled: true
      }
    } as const

    return isMedium
      ? { ...hideLineNumberOptions }
      : { ...showLineNumberOptions }
  }, [isMedium])

  const handleOnMount = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor: any, monaco: Monaco) => {
      handleEditorDidMount(monaco, editor)
    },
    [handleEditorDidMount]
  )

  return (
    <MonacoEditor
      height="100%"
      width="100%"
      options={options as any}
      language={currentExt}
      value={currentContent}
      theme={selectedTheme === 'vs-dark' ? 'modern-dark' : 'modern-light'}
      beforeMount={defineMonacoThemes}
      onMount={handleOnMount}
      loading={<LoadingEditor />}
      onChange={onChange}
    />
  )
}

export default Editor
