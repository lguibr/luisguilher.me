import useWindow from 'src/hooks/useWindow'
import useContextTheme from 'src/hooks/useContextTheme'
import { useEffect, useRef } from 'react'
import { DiffEditor, Monaco } from '@monaco-editor/react'

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
  }

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
  }
  const editorRef = useRef({ revealLine: (n: number) => !n && console.log(n) })

  useEffect(() => {
    if (editorRef?.current?.revealLine) editorRef?.current?.revealLine(1)
  }, [])

  const handleEditorDidMount = (monaco: Monaco, editor: Monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true
    })

    editorRef.current = editor

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      onlyVisible: true
    })

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      comments: 'ignore'
    })
  }

  const options = isMedium
    ? { ...hideLineNumberOptions }
    : { ...showLineNumberOptions }

  return (
    <DiffEditor
      options={options}
      language={currentExt}
      original={currentContent}
      modified={currentNewContent}
      theme={selectedTheme}
      onMount={(editor, monaco) => handleEditorDidMount(monaco, editor)}
      loading={<LoadingEditor />}
    />
  )
}

export default DiffEditorComponent
