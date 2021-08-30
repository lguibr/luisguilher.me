import useWindow from 'src/hooks/useWindow'
import useContextTheme from 'src/hooks/useContextTheme'
import MonacoEditor, { Monaco } from '@monaco-editor/react'

import { useRef } from 'react'

type EditorProps = {
  currentExt: string
  path: string
  currentContent: string
  onChange: (value?: string | undefined) => void
}

const Editor: React.FC<EditorProps> = ({
  currentExt,
  currentContent,
  onChange,
  path
}) => {
  const LoadingEditor = () => {
    return <div />
  }

  const editorRef = useRef(null)

  const { selectedTheme } = useContextTheme()
  const { isMedium } = useWindow()

  const agnosticConfig = {
    quickSuggestions: false
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
  }

  const showLineNumberOptions = {
    lineNumbers: 'on',
    glyphMargin: true,
    wordWrap: 'on',
    folding: true,
    ...agnosticConfig,
    minimap: {
      enabled: true
    }
  }

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
    <MonacoEditor
      options={options}
      language={currentExt}
      value={currentContent}
      theme={selectedTheme}
      onMount={(editor, monaco) => handleEditorDidMount(monaco, editor)}
      loading={<LoadingEditor />}
      onChange={onChange}
      path={path}
      line={1}
    />
  )
}

export default Editor
