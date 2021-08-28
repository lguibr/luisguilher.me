import { createContext, useState, useEffect, useReducer, Dispatch } from 'react'
import YAML from 'yaml'
import education from 'src/assets/education'
import experiences from 'src/assets/experiences'
import coverLetter from 'src/assets/coverLetter'
import contacts from 'src/assets/contacts'
import skills from 'src/assets/skills'
import useTree from 'src/hooks/useTree'
import fileReducer, {
  FileType as FileT,
  ActionType
} from 'src/reducers/FileReducer'
import githubService from 'services/github'
import { useWindowSize } from 'src/hooks/useWindow'
import useSideBar from 'src/hooks/useSideBar'
export type FileType = FileT

export type FileContextType = {
  files: FileType[]
  treeFiles: FileType[]
  currentFile: FileType | undefined
  highLighted: FileType | undefined
  openedFiles: FileType[]
  diffFiles: FileType[]
  setCurrentFile: (file: FileType) => void
  closeAllFiles: () => void
  setHighLighted: (file: FileType) => void
  setFiles: (files: FileType[]) => void
  closeFile: (file: FileType) => void
  openFile: (file: FileType) => void
  setContent: (file: FileType, content: string) => void
  setImage: (file: FileType, content: JSX.Element) => void
  setNewContent: (file: FileType, content: string) => void
}

export const FileContext = createContext({} as FileContextType)
export const FileProvider: React.FC = ({ children }) => {
  const { isMedium } = useWindowSize()
  const { setOpen } = useSideBar()
  const repoName = process.env.REPO || 'luisguilher.me'
  const { build, flatTree } = useTree()
  const [tree, setTree] = useState<FileType[]>([])
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

  const setCurrentFile = (selectedFile: FileType | undefined) => {
    selectedFile && dispatch({ type: 'SET_CURRENT', payload: selectedFile })
    !selectedFile && dispatch({ type: 'SET_CURRENT', payload: { path: '/' } })
  }

  const openFile = (selectedFile: FileType | undefined) => {
    isMedium && setOpen(false)
    selectedFile && dispatch({ type: 'OPEN_FILE', payload: selectedFile })
    !selectedFile && dispatch({ type: 'CLEAN_OPEN', payload: { path: '/' } })
  }

  const setHighLighted = (selectedFile: FileType | undefined) => {
    selectedFile && dispatch({ type: 'SET_HIGHLIGHTED', payload: selectedFile })
    !selectedFile &&
      dispatch({ type: 'CLEAN_HIGHLIGHTED', payload: { path: '/' } })
  }

  const setImage = (selectedFile: FileType, image: JSX.Element) => {
    dispatch({ type: 'SET_IMAGE', payload: { ...selectedFile, image } })
  }

  const closeFile = (selectedFile: FileType): void => {
    dispatch({ type: 'CLOSE_FILE', payload: selectedFile })
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

  const closeAllFiles = () => {
    dispatch({ type: 'CLOSE_FILES', payload: { path: '/' } })
  }

  const setFiles = (files: FileType[]) => {
    dispatch({ type: 'SET_FILES', payload: files })
  }

  const compare = (a: FileType, b: FileType) => {
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

  const diffFiles = files.filter(({ isDiff, diff }) => isDiff && diff)
  const openedFiles = files.filter(({ open }) => open).sort(compare)
  const highLighted = files.find(({ highLighted }) => highLighted)
  const currentFile = files.find(({ current }) => current)
  const onSetHighlight = (file: FileType): void => {
    if (highLighted?.name === file?.name && !file?.children?.length) {
      setCurrentFile(file)
    }
    setHighLighted(file)
  }

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

  const fetchTree = async () => {
    const rawTree = await githubService.fetchRepoTree()
    const newTree = build(rawTree)
    setTree(newTree)
  }

  useEffect(() => {
    fetchTree()
  }, [])

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
        diffFiles,
        closeAllFiles,
        highLighted,
        setCurrentFile,
        setHighLighted: onSetHighlight
      }}
    >
      {children}
    </FileContext.Provider>
  )
}
