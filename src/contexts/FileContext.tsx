import { createContext, useState, useEffect } from 'react'
import education from 'src/assets/education'
import experiences from 'src/assets/experiences'
import useTree from 'src/hooks/useTree'

export type File = {
  name?: string
  content?: string
  newContent?: string
  path: string
  open?: boolean
  highLighted?: boolean
  current?: boolean
  children?: File[]
  index?: number
}

export type FileContextType = {
  files: File[]
  treeFiles: File[]
  currentFile: File | undefined
  highLighted: File | undefined
  openedFiles: File[]
  setCurrentFile: (file: File) => void
  setHighLighted: (file: File) => void
  closeFile: (file: File) => void
  openFile: (file: File) => void
  setContent: (file: File, content: string) => void
  setNewContent: (file: File, content: string) => void
}

export const FileContext = createContext({} as FileContextType)
export const FileProvider: React.FC = ({ children }) => {
  const repoName = process.env.REPO || 'luisguilher.me'
  const { tree } = useTree()
  const educationText = JSON.stringify(education, null, 2)
  const experiencesText = JSON.stringify(experiences, null, 2)
  useEffect(() => {
    if (tree) {
      const newFiles = treeFiles.map(file => ({
        ...file,
        children: file.path === repoName ? tree : file?.children
      }))

      setTreeFiles(newFiles)
      setFiles(flatTree(newFiles))
    }
  }, [tree])
  const resumeFiles = [
    {
      path: 'resume/education.json',
      name: 'education.json',
      content: educationText
    },
    {
      path: 'resume/experience.json',
      name: 'experience.json',
      content: experiencesText
    },
    { path: 'resume/teste3', name: 'teste3', content: `{ name: 'teste3' }` },
    { path: 'resume/teste4', name: 'teste4', content: `{ name: 'teste4' }` },
    { path: 'resume/teste5', name: 'teste5', content: `{ name: 'teste5' }` }
  ]

  type treeFile = {
    path: string
    name?: string
    content?: string
    children?: treeFile[]
  }

  const flatTree = (tree: treeFile[]) => {
    const flattedTree: treeFile[] = []
    const flatADepth = (tree: treeFile[]) => {
      tree.forEach(node => {
        const { children } = node
        flattedTree.push(node)
        if (children?.length) {
          flatADepth(children)
        }
      })
    }
    flatADepth(tree)
    return flattedTree
  }
  const [treeFiles, setTreeFiles] = useState([
    {
      path: 'resume',
      name: 'resume',
      children: resumeFiles
    },
    { path: repoName, name: repoName, children: tree }
  ])
  const [files, setFiles] = useState<File[]>(flatTree(treeFiles))

  const onSetCurrentFile = (selectedFile: File | undefined) => {
    const newFiles = files.map(file => ({
      ...file,
      current: selectedFile?.path === file?.path,
      highLighted: selectedFile?.path === file?.path
    }))
    setFiles(newFiles)
  }
  const openFile = (selectedFile: File | undefined) => {
    const indexes: number[] = files
      .filter(({ index }) => index)
      .map(({ index }) => index || 0)

    const max = indexes.length && Math.max(...indexes)

    const newFiles = files.map(file => ({
      ...file,
      current: selectedFile?.path === file?.path,
      highLighted: selectedFile?.path === file?.path,
      open: selectedFile?.path === file?.path ? true : !!file?.open,
      index:
        selectedFile?.path === file?.path && !file?.open ? max + 1 : file?.index
    }))
    setFiles(newFiles)
  }
  const onSetHighLighted = (selectedFile: File | undefined) => {
    const newFiles = files.map(file => ({
      ...file,
      highLighted: selectedFile?.path === file?.path
    }))
    setFiles(newFiles)
  }
  const compare = (a: File, b: File) => {
    if (!a?.index || !b?.index) {
      return 0
    }
    if (a?.index < b?.index) {
      return -1
    }
    if (a?.index > b?.index) {
      return 1
    }
    return 0
  }
  const openedFiles = files.filter(({ open }) => open).sort(compare)
  const highLighted = files.find(({ highLighted }) => highLighted)
  const currentFile = files.find(({ current }) => current)
  const onSetHighlight = (file: File): void => {
    if (highLighted?.name === file?.name && !file?.children?.length) {
      onSetCurrentFile(file)
    }
    onSetHighLighted(file)
  }
  const closeFile = (file: File): void => {
    const { path } = file
    const newFilesOpenFixed = files.map(newFile => ({
      ...newFile,
      open: newFile?.path === path ? false : newFile?.open,
      index: newFile?.path === path ? undefined : newFile?.index
    }))
    const newOpenedFiles = newFilesOpenFixed.filter(({ open }) => open)
    const maxCallback = (previousFile?: File, currentFile?: File) => {
      if (
        !previousFile ||
        !currentFile ||
        !previousFile?.index ||
        !currentFile?.index
      )
        return undefined
      return previousFile?.index > currentFile?.index
        ? previousFile
        : currentFile
    }

    const lastFileOpened = newOpenedFiles.reduce(maxCallback, newOpenedFiles[0])
    const newFiles = newFilesOpenFixed.map(newFile => ({
      ...newFile,
      current: lastFileOpened?.path === newFile.path,
      highLighted: lastFileOpened?.path === newFile.path
    }))
    setFiles(newFiles)
  }
  const setContent = (selected: File, content: string) => {
    const newFiles = files.map(file => ({
      ...file,
      content: file?.path === selected.path ? content : file?.content
    }))
    setFiles(newFiles)
  }
  const setNewContent = (selected: File, content: string) => {
    const newFiles = files.map(file => ({
      ...file,
      newContent: file?.path === selected.path ? content : file?.content
    }))
    setFiles(newFiles)
  }
  return (
    <FileContext.Provider
      value={{
        files,
        treeFiles,
        setContent,
        setNewContent,
        closeFile,
        openFile,
        currentFile,
        openedFiles,
        highLighted,
        setCurrentFile: onSetCurrentFile,
        setHighLighted: onSetHighlight
      }}
    >
      {children}
    </FileContext.Provider>
  )
}
