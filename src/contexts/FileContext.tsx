import { createContext, useState, useEffect, useReducer, Dispatch } from 'react'
import { getResumeData } from './getResumeFiles'
import useTree from 'src/hooks/useTree'
import fileReducer, {
  FileType as FileT,
  ActionType
} from 'src/reducers/FileReducer'
import githubService from 'src/services/github'

export type FileType = FileT

export type FileContextType = {
  files: FileType[]
  treeFiles: FileType[]
  diffFiles: FileType[]
  setFiles: (files: FileType[]) => void
  setContent: (file: FileType, content: string) => void
  setImage: (file: FileType, content: JSX.Element | undefined) => void
  setNewContent: (file: FileType, content: string) => void
  focusedFile: string | null
  setFocusedFile: (file: string | null) => void
  findTreeFile: (path: string) => FileType | null
  focusedFileView: number
  setFocusedFileView: (file: number) => void
}

export const FileContext = createContext({} as FileContextType)

export const FileProvider: React.FC = ({ children }) => {
  const repoName = process.env.REPO || 'luisguilher.me'
  const { build, flatTree } = useTree()
  const [tree, setTree] = useState<FileType[]>([])
  const resumeFiles = getResumeData()

  const [treeFiles, setTreeFiles] = useState<FileType[]>([
    {
      path: 'resume',
      name: 'resume',
      children: resumeFiles
    },
    { path: repoName, name: repoName, children: [] }
  ])

  const initialFiles = flatTree(treeFiles)
  const initialDiffFiles: FileType[] = initialFiles.map(file => ({
    ...file,
    isDiff: true,
    path: file?.path.concat('__working__tree__')
  }))
  const initialState = initialFiles.concat(initialDiffFiles)
  const [files, dispatch]: [files: FileType[], dispatch: Dispatch<ActionType>] =
    useReducer(fileReducer, initialState)

  const setImage = (selectedFile: FileType, image: JSX.Element | undefined) => {
    dispatch({ type: 'SET_IMAGE', payload: { ...selectedFile, image } })
  }

  const setContent = (selectedFile: FileType, content: string) => {
    dispatch({ type: 'SET_CONTENT', payload: { ...selectedFile, content } })
  }

  const setNewContent = (selectedFile: FileType, newContent: string) => {
    dispatch({
      type: 'SET_NEW_CONTENT',
      payload: { ...selectedFile, newContent }
    })
  }

  const setFiles = (files: FileType[]) => {
    dispatch({ type: 'SET_FILES', payload: files })
  }

  const findTreeFile = (path: string, files: FileType[]): FileType | null => {
    for (const file of files) {
      if (file.path === path) {
        return file
      }
      if (file.children) {
        const found = findTreeFile(path, file.children)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  const diffFiles = files.filter(({ isDiff, diff }) => isDiff && diff)

  useEffect(() => {
    if (tree) {
      const newTreeFiles = treeFiles.map(file => ({
        ...file,
        children: file.path === repoName ? tree : file?.children
      }))

      const newFiles: FileType[] = flatTree(newTreeFiles)
      const newDiffFiles: FileType[] = newFiles.map(file => ({
        ...file,
        isDiff: true,
        path: file?.path.concat('__working__tree__')
      }))

      setTreeFiles(newTreeFiles)
      setFiles(newFiles.concat(newDiffFiles))
    }
  }, [tree])

  useEffect(() => {
    const fetchTree = async () => {
      const rawTree = await githubService.fetchRepoTree()
      const newTree = build(rawTree)
      setTree(newTree)
    }

    fetchTree()
  }, [])

  const [focusedFile, setFocusedFile] = useState<string | null>(
    'resume/complete-resume.yml'
  )
  const [focusedFileView, setFocusedFileView] = useState<number>(0)

  return (
    <FileContext.Provider
      value={{
        files,
        setFiles,
        treeFiles,
        setContent,
        setImage,
        setNewContent,
        diffFiles,
        focusedFile,
        setFocusedFile,
        findTreeFile: (path: string) => findTreeFile(path, treeFiles),
        focusedFileView,
        setFocusedFileView
      }}
    >
      {children}
    </FileContext.Provider>
  )
}
