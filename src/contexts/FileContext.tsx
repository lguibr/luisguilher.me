import { createContext, useState, useEffect } from 'react'
import YAML from 'yaml'
import education from 'src/assets/education'
import experiences from 'src/assets/experiences'
import coverLetter from 'src/assets/coverLetter'
import contacts from 'src/assets/contacts'
import skills from 'src/assets/skills'
import useTree from 'src/hooks/useTree'

export type File = {
  name?: string
  content?: string
  newContent?: string
  path: string
  open?: boolean
  highLighted?: boolean
  current?: boolean
  image?: JSX.Element
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
  closeAllFiles: () => void
  setHighLighted: (file: File) => void
  setFiles: (files: File[]) => void
  closeFile: (file: File) => void
  openFile: (file: File) => void
  setContent: (file: File, content: string) => void
  setImage: (file: File, content: JSX.Element) => void
  setNewContent: (file: File, content: string) => void
}

export const FileContext = createContext({} as FileContextType)
export const FileProvider: React.FC = ({ children }) => {
  const repoName = process.env.REPO || 'luisguilher.me'
  const { tree } = useTree()

  const coverLetterText = JSON.stringify(coverLetter.join(''), null, 2)
  const skillsText = JSON.stringify(skills, null, 2)
  const educationText = JSON.stringify(education, null, 2)
  const experiencesText = JSON.stringify(experiences, null, 2)
  const contactsText = JSON.stringify(contacts, null, 2)

  const completeResumeText = YAML.stringify({
    'Cover Letter': coverLetter.join(''),
    Contacts: contacts,
    Education: education,
    Experiences: experiences,
    Skills: skills
  })
    .replace(
      /(Education:|Experiences:|Contacts:|- Company:|- School:|Skills:|- Languages:|- Programming Language:|- Development Tools:|- Front-end:|- Back-end:|- Cloud\/Infra:)/g,
      '\n$&'
    )
    .replace(/(Cover Letter:|Contacts:)/g, '$&\n')
    .replace(/Cover Letter:/, '$&\n')

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
      path: 'resume/cover-letter.json',
      name: 'cover-letter.json',
      content: coverLetterText,
      newContent: coverLetterText
    },
    {
      path: 'resume/education.json',
      name: 'education.json',
      content: educationText,
      newContent: educationText
    },
    {
      path: 'resume/experience.json',
      name: 'experience.json',
      content: experiencesText,
      newContent: experiencesText
    },
    {
      path: 'resume/skills.json',
      name: 'skills.json',
      content: skillsText,
      newContent: skillsText
    },
    {
      path: 'resume/contacts.json',
      name: 'contacts.json',
      content: contactsText,
      newContent: contactsText
    },
    {
      path: 'resume/complete-resume.yml',
      name: 'complete-resume.yml',
      content: completeResumeText,
      newContent: completeResumeText
    }
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

  const setImage = (selected: File, image: JSX.Element) => {
    const newFiles = files.map(file => ({
      ...file,
      image: file?.path === selected.path ? image : file?.image
    }))
    setFiles(newFiles)
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
      content: file?.path === selected.path ? content : file?.content,
      newContent: file?.path === selected.path ? content : file?.newContent
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
  const closeAllFiles = () => {
    const newFiles = files.map(file => ({
      ...file,
      open: false,
      highLighted: false,
      current: false
    }))
    setFiles(newFiles)
  }

  return (
    <FileContext.Provider
      value={{
        files,
        setFiles,
        treeFiles,
        setContent,
        setImage,
        setNewContent,
        closeFile,
        openFile,
        currentFile,
        openedFiles,
        closeAllFiles,
        highLighted,
        setCurrentFile: onSetCurrentFile,
        setHighLighted: onSetHighlight
      }}
    >
      {children}
    </FileContext.Provider>
  )
}
