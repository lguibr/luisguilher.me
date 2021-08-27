import useWindow from 'src/hooks/useWindow'
import useContextTheme from 'src/hooks/useContextTheme'
import MonacoEditor, { Monaco } from '@monaco-editor/react'

type EditorProps = {
  currentExt: string
  // | 'abap'
  // | 'aes'
  // | 'apex'
  // | 'azcli'
  // | 'bat'
  // | 'bicep'
  // | 'c'
  // | 'cameligo '
  // | 'clojure'
  // | 'coffeescript '
  // | 'cpp '
  // | 'csharp '
  // | 'csp '
  // | 'css '
  // | 'dart '
  // | 'dockerfile '
  // | 'ecl '
  // | 'elixir '
  // | 'fsharp '
  // | 'go '
  // | 'graphql '
  // | 'handlebars '
  // | 'hcl '
  // | 'html '
  // | 'ini '
  // | 'java '
  // | 'javascript '
  // | 'json '
  // | 'julia '
  // | 'kotlin '
  // | 'less '
  // | 'lexon '
  // | 'liquid '
  // | 'lua '
  // | 'm3 '
  // | 'markdown '
  // | 'mips '
  // | 'msdax '
  // | 'mysql '
  // | 'objective '
  // | 'pascal '
  // | 'pascaligo '
  // | 'perl '
  // | 'pgsql '
  // | 'php '
  // | 'plaintext '
  // | 'postiats '
  // | 'powerquery '
  // | 'powershell '
  // | 'pug '
  // | 'python '
  // | 'qsharp '
  // | 'r '
  // | 'razor '
  // | 'redis '
  // | 'redshift '
  // | 'restructuredtext '
  // | 'ruby '
  // | 'rust '
  // | 'sb '
  // | 'scala '
  // | 'scheme '
  // | 'scss '
  // | 'shell '
  // | 'sol '
  // | 'sparql '
  // | 'sql '
  // | 'st '
  // | 'swift '
  // | 'systemverilog '
  // | 'tcl '
  // | 'twig '
  // | 'typescript '
  // | 'vb '
  // | 'verilog '
  // | 'xml '
  // | 'yaml'
  currentContent: string
  onChange: (value?: string | undefined) => void
}

const Editor: React.FC<EditorProps> = ({
  currentExt,
  currentContent,
  onChange
}) => {
  const LoadingEditor = () => {
    return <div />
  }

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

  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true
    })

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
      onMount={(_monaco, editor) => handleEditorDidMount(editor)}
      loading={<LoadingEditor />}
      onChange={onChange}
    />
  )
}

export default Editor
