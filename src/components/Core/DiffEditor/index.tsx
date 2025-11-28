import useWindow from 'src/hooks/useWindow'
import useContextTheme from 'src/hooks/useContextTheme'
import { useEffect, useRef } from 'react'
import { DiffEditor, Monaco } from '@monaco-editor/react'
import { defineMonacoThemes } from 'src/styles/monaco'

type EditorProps = {
  currentExt: string
  currentContent: string
  currentNewContent: string
}

const DiffEditorComponent: React.FC<EditorProps> = ({
  currentExt,
  currentContent,
  currentNewContent
}) => {
  const LoadingEditor = () => {
    return <div />
  }

  const { selectedTheme } = useContextTheme()
  const { isMedium } = useWindow()

  const agnosticConfig = {
    quickSuggestions: false,
    model: null,
    readOnly: true
  }

  const hideLineNumberOptions = {
    enableSplitViewResizing: false,
    renderSideBySide: false,
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
    enableSplitViewResizing: true,
    renderSideBySide: true,
    lineNumbers: 'on',
    glyphMargin: true,
    wordWrap: 'on',
    folding: true,
    ...agnosticConfig,
    minimap: {
      enabled: true
    }
  } as const
  const editorRef = useRef({ revealLine: (n: number) => !n && console.log(n) })

  useEffect(() => {
    if (editorRef?.current?.revealLine) editorRef?.current?.revealLine(1)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (monaco: Monaco, editor: any) => {
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
  }

  const options = isMedium
    ? { ...hideLineNumberOptions }
    : { ...showLineNumberOptions }

  return (
    <DiffEditor
      options={options as any}
      language={currentExt}
      original={currentContent}
      modified={currentNewContent}
      theme={selectedTheme === 'vs-dark' ? 'modern-dark' : 'modern-light'}
      beforeMount={defineMonacoThemes}
      onMount={(editor, monaco) => handleEditorDidMount(monaco, editor)}
      loading={<LoadingEditor />}
    />
  )
}

export default DiffEditorComponent
