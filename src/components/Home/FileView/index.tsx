import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import useWindow from 'src/hooks/useWindow'
import useContextFile from 'src/hooks/useContextFile'
import useContextTheme from 'src/hooks/useContextTheme'
import useContextLoading from 'src/hooks/useLoading'
import { Container, EditorContainer } from './styled'
import Background from './Background'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false
})

const FileView: React.FC = () => {
  const { setLoading } = useContextLoading()

  const LoadingEditor = () => {
    useEffect(() => {
      setLoading(true)
    }, [])
    return <div />
  }
  const [currentContent, setCurrentContent] = useState<string>('')
  const [currentExt, setCurrentExt] = useState<string>('json')

  const { currentFile, setContent, setNewContent } = useContextFile()
  const { selectedTheme } = useContextTheme()
  const { isMedium } = useWindow()

  const fetchFileByPath = async (path: string) => {
    setLoading(true)
    const branchSha = process.env.shaBranch
    const filePath = `https://api.github.com/repos/lguibr/luisguilher.me/contents/${path}?ref=${branchSha}`
    const res = await fetch(filePath)
    const data = await res.json()

    const rawFile = await decodeURIComponent(escape(window.atob(data.content)))
    currentFile && setContent(currentFile, rawFile)
  }

  useEffect(() => {
    if (currentContent) {
      const debounce = setTimeout(() => {
        currentContent && setLoading(false)
      }, 1500)
      return () => clearTimeout(debounce)
    }
  }, [currentContent])

  useEffect(() => {
    const currentContent = currentFile?.content
    const currentNewContent = currentFile?.newContent
    const currentPath = currentFile?.path

    if (currentContent) {
      currentContent && setCurrentContent(currentNewContent || currentContent)
    } else if (currentPath) {
      fetchFileByPath(currentPath)
    }
  }, [currentFile])

  const agnosticConfig = {
    quickSuggestions: false
  }

  type Monaco = {
    languages: {
      typescript: {
        typescriptDefaults: {
          setCompilerOptions: (options: {
            noLib?: boolean
            allowNonTsExtensions?: boolean
          }) => void
          setDiagnosticsOptions: (options: {
            noSemanticValidation?: boolean
            allowNonTsExtensions?: boolean
            noSyntaxValidation?: boolean
            onlyVisible?: boolean
          }) => void
        }
      }
      json: {
        jsonDefaults: {
          setDiagnosticsOptions: (option: { comments: string }) => void
        }
      }
    }
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

  useEffect(() => {
    const splittedPath = currentFile?.path?.split('.')
    const ext = !!splittedPath?.length && splittedPath[splittedPath.length - 1]
    const languages = [
      {
        name: 'json',
        regex: /lock|json/
      },
      {
        name: 'javascript',
        regex: /js/
      },
      {
        name: 'typescript',
        regex: /ts/
      },
      {
        name: 'yaml',
        regex: /editorconfig|Dockerfile|yaml|yml|gitignore/
      },
      {
        name: 'markdown',
        regex: /md/
      }
    ]

    const selectedLanguage =
      languages.find(({ regex }) => ext && ext.match(regex))?.name || 'json'

    setCurrentExt(selectedLanguage)
  }, [currentFile])
  return (
    <Container>
      <Background />
      <EditorContainer currentFile={!!currentFile}>
        {currentFile && (
          <MonacoEditor
            options={options}
            defaultLanguage="json"
            language={currentExt}
            value={currentContent}
            theme={selectedTheme}
            onMount={(_monaco, editor) => handleEditorDidMount(editor)}
            loading={<LoadingEditor />}
            onChange={currentValue => {
              currentFile && setNewContent(currentFile, currentValue || '')
            }}
          />
        )}
      </EditorContainer>
    </Container>
  )
}

export default FileView
