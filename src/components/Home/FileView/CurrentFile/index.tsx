// File: src/components/Home/FileView/CurrentFile/index.tsx
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import githubService from 'src/services/github'
import useExtension from 'src/hooks/useExtension'
import useContextLoading from 'src/hooks/useLoading'
import useContextFile from 'src/hooks/useContextFile'
import useContextFileView from 'src/hooks/useContextFileView'
import CoreEditor from 'src/components/Core/Editor'
import DiffEditor from 'src/components/Core/DiffEditor'
import { FileType } from 'src/reducers/FileReducer'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Container, ToggleButton } from './styled'
import SkeletonLoader from 'src/components/Core/SkeletonLoader'
import EyeIcon from 'public/icons/eye.svg'
import PenIcon from 'public/icons/pen.svg'

const DynamicMarkdownPreview = dynamic(
  () => import('src/components/Core/MarkdownPreview'),
  {
    ssr: false,
    loading: function Loading() {
      return <SkeletonLoader />
    }
  }
)

const parsePath = (
  fullPath: string | null | undefined
): { owner: string; repo: string; path: string; branch: string } | null => {
  if (!fullPath) return null
  const defaultOwner = process.env.OWNER || 'lguibr'
  const defaultRepo = process.env.REPO || 'luisguilher.me'
  const defaultBranch = process.env.SHA_BRANCH || 'main'
  const parts = fullPath.split('/')
  if (parts[0] === 'repositories' && parts.length >= 2) {
    const repoName = parts[1]
    const actualPath = parts.length > 2 ? parts.slice(2).join('/') : ''
    const owner = process.env.GITHUB_USERNAME || defaultOwner
    const branch = 'main'
    return { owner, repo: repoName, path: actualPath, branch }
  } else if (parts[0] === 'resume') {
    return {
      owner: defaultOwner,
      repo: defaultRepo,
      path: fullPath,
      branch: defaultBranch
    }
  } else {
    const mainRepoName = defaultRepo
    const actualPath = fullPath === mainRepoName ? '' : fullPath
    return {
      owner: defaultOwner,
      repo: mainRepoName,
      path: actualPath,
      branch: defaultBranch
    }
  }
}

const Editor: React.FC<{ id: number }> = ({ id }) => {
  const { fetchFileContent } = githubService
  const { extractExtension } = useExtension()
  const { loading, setLoading } = useContextLoading()
  const { files, findTreeFile, setContent, setNewContent, setImage } =
    useContextFile()
  const rootContext = useContextFileView()
  const { findNodeById } = rootContext
  const subTree = findNodeById(id, rootContext)

  const currentFilePath = subTree?.currentFile

  const [displayContent, setDisplayContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isCurrentDirectory, setIsCurrentDirectory] = useState(false)
  const [currentFileObject, setCurrentFileObject] = useState<FileType | null>(
    null
  )

  const prevFilePathRef = useRef<string | null | undefined>()
  const isFetchingRef = useRef(false)

  const isMarkdown = useMemo(
    () =>
      currentFilePath
        ? extractExtension(currentFilePath) === 'markdown'
        : false,
    [currentFilePath, extractExtension]
  )

  useEffect(() => {
    if (currentFilePath === prevFilePathRef.current && !isFetchingRef.current) {
      return
    }
    prevFilePathRef.current = currentFilePath

    if (!currentFilePath) {
      if (displayContent !== '') setDisplayContent('')
      if (isPreview) setIsPreview(false)
      if (isCurrentDirectory) setIsCurrentDirectory(false)
      if (currentFileObject !== null) setCurrentFileObject(null)
      if (loading) setLoading(false)
      return
    }

    const fileData = findTreeFile(currentFilePath)

    if (fileData?.path !== currentFileObject?.path) {
      setCurrentFileObject(fileData)
    }

    if (!fileData) {
      console.warn(
        `[CurrentFile] File data not found via findTreeFile for path: ${currentFilePath}`
      )
      const errorMsg = `// Error: File data not found for ${currentFilePath}`
      if (displayContent !== errorMsg) setDisplayContent(errorMsg)
      if (isPreview) setIsPreview(false)
      if (isCurrentDirectory) setIsCurrentDirectory(false)
      if (loading) setLoading(false)
      return
    }

    const isDirectory =
      fileData.type === 'tree' ||
      fileData.type === 'repo-root' ||
      fileData.type === 'placeholder-repo-root'
    const isMd = extractExtension(fileData.path) === 'markdown'
    const newIsPreview = isMd && !isDirectory
    const newDisplayContent =
      fileData.newContent ??
      fileData.content ??
      (isDirectory ? `// Directory: ${fileData.name}` : '')

    if (isCurrentDirectory !== isDirectory) setIsCurrentDirectory(isDirectory)
    setIsPreview(newIsPreview)

    if (isDirectory) {
      const dirMsg = `// Directory: ${fileData.name}`
      if (displayContent !== dirMsg) setDisplayContent(dirMsg)
      if (loading) setLoading(false)
    } else if (fileData.image) {
      if (displayContent !== '') setDisplayContent('')
      if (loading) setLoading(false)
    } else if (fileData.content !== undefined && fileData.content !== null) {
      if (displayContent !== newDisplayContent)
        setDisplayContent(newDisplayContent)
      if (loading) setLoading(false)
    } else {
      if (fileData.type === 'resume') {
        console.error(
          `[CurrentFile ERROR] Reached fetch block for RESUME file without content: ${currentFilePath}`,
          fileData
        )
        const resumeErrorMsg = `// Error: Could not load resume content for ${fileData.name}`
        if (displayContent !== resumeErrorMsg) setDisplayContent(resumeErrorMsg)
        if (loading) setLoading(false)
        return
      }

      if (displayContent !== '') setDisplayContent('')
      if (!loading) setLoading(true)
      isFetchingRef.current = true

      const parsedPathInfo = parsePath(currentFilePath)

      if (!parsedPathInfo) {
        console.error(
          `[CurrentFile] Cannot fetch - invalid parsed path info for: ${currentFilePath}`
        )
        const errorMsg = `// Error: Cannot load file ${fileData.name}`
        if (displayContent !== errorMsg) setDisplayContent(errorMsg)
        if (loading) setLoading(false)
        isFetchingRef.current = false
        return
      }
      if (
        parsedPathInfo.path === '' &&
        (currentFilePath.startsWith('repositories/') ||
          currentFilePath === process.env.REPO)
      ) {
        console.warn(
          `[CurrentFile] Attempted to fetch content for repo root: ${currentFilePath}. Skipping.`
        )
        const repoRootMsg = `// Cannot display content for repository root: ${fileData.name}`
        if (displayContent !== repoRootMsg) setDisplayContent(repoRootMsg)
        if (loading) setLoading(false)
        isFetchingRef.current = false
        return
      }

      fetchFileContent(
        parsedPathInfo.owner,
        parsedPathInfo.repo,
        parsedPathInfo.path,
        parsedPathInfo.branch
      )
        .then(data => {
          const currentFileData = findTreeFile(currentFilePath)
          if (!currentFileData) return

          const isImage = /\.(png|jpg|jpeg|ico)$/i.test(parsedPathInfo.path)
          if (isImage) {
            const imageSrc = `data:image/jpeg;charset=utf-8;base64,${data.content}`
            const imageElement = (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '20px'
                }}
              >
                {' '}
                <Image
                  src={imageSrc}
                  alt={`Image for ${currentFileData.name}`}
                  layout="intrinsic"
                  width={500}
                  height={500}
                  objectFit="contain"
                />{' '}
              </div>
            )
            if (!currentFileData.image) setImage(currentFileData, imageElement)
            if (displayContent !== '') setDisplayContent('')
            if (isPreview) setIsPreview(false)
          } else {
            const rawFile = decodeURIComponent(
              escape(window.atob(data.content))
            )
            setContent(currentFileData, rawFile)
            const fetchedIsMd = extractExtension(currentFilePath) === 'markdown'
            if (displayContent !== rawFile) setDisplayContent(rawFile)
            if (isPreview !== fetchedIsMd) setIsPreview(fetchedIsMd)
            if (currentFileData.image) setImage(currentFileData, undefined)
          }
        })
        .catch((error: any) => {
          console.error(
            `[CurrentFile] Error fetching content for ${currentFilePath}:`,
            error
          )
          const errorMsg = `// Error loading file: ${fileData.name}\n// ${
            error.message || error
          }`
          if (displayContent !== errorMsg) setDisplayContent(errorMsg)
          const currentFileData = findTreeFile(currentFilePath)
          if (currentFileData?.image) setImage(currentFileData, undefined)
        })
        .finally(() => {
          if (loading) setLoading(false)
          isFetchingRef.current = false
        })
    }
  }, [
    currentFilePath,
    findTreeFile,
    setContent,
    setImage,
    setLoading,
    extractExtension
  ])

  // --- Effect for Keyboard Shortcut ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, metaKey } = event

      // Check for Ctrl+Shift+M or Cmd+Shift+M
      if (shiftKey && (ctrlKey || metaKey) && key.toLowerCase() === 'm') {
        // Changed 'c' to 'm'
        console.log('[CurrentFile] Keydown event:', { key, ctrlKey, shiftKey })
        console.log(
          `[CurrentFile] isMarkdown:${isMarkdown} - isCurrentDirectory :${isCurrentDirectory}`
        )
        if (isMarkdown && !isCurrentDirectory) {
          event.preventDefault()

          // console.log('[CurrentFile] Toggling Markdown preview via shortcut.');
          setIsPreview(prev => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMarkdown, isCurrentDirectory])

  // --- Event Handlers ---
  const handleDoubleClick = () => {
    if (isMarkdown && !isCurrentDirectory) {
      setIsPreview(prev => !prev)
    }
  }

  const handleContentChange = useCallback(
    (value?: string) => {
      const fileData = currentFileObject
      if (fileData && !isCurrentDirectory) {
        setNewContent(fileData, value || '')
        setDisplayContent(value || '')
      }
    },
    [currentFileObject, isCurrentDirectory, setNewContent]
  )

  // --- Render Logic ---
  if (!currentFilePath) {
    return null
  }

  const fileDataFromContext = files.find(f => f.path === currentFilePath)

  if (!fileDataFromContext) {
    console.error(
      `[CurrentFile Render] File data missing from flat 'files' state for path: ${currentFilePath} `
    )
    return <div>Error: File data missing.</div>
  }

  if (isCurrentDirectory) {
    return (
      <CoreEditor
        onChange={() => undefined}
        currentContent={displayContent}
        currentExt={'plaintext'}
      />
    )
  }

  if (fileDataFromContext.image) {
    return fileDataFromContext.image
  }

  const currentExt = extractExtension(currentFilePath)

  console.log('[CurrentFile] Render:', {
    path: currentFilePath,
    isDiff: fileDataFromContext.isDiff,
    isPreview,
    displayContentLen: displayContent.length
  })

  const content = (
    <>
      {isMarkdown && isPreview ? (
        <div
          onDoubleClick={handleDoubleClick}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
        >
          <DynamicMarkdownPreview markdown={displayContent} />
        </div>
      ) : !fileDataFromContext.isDiff ? (
        <CoreEditor
          onChange={handleContentChange}
          currentContent={displayContent}
          currentExt={currentExt}
        />
      ) : (
        <DiffEditor
          currentContent={fileDataFromContext.content || ''}
          currentNewContent={fileDataFromContext.newContent || ''}
          currentExt={currentExt}
        />
      )}
    </>
  )

  // ...

  if (loading && !displayContent && !fileDataFromContext.image) {
    return <SkeletonLoader />
  }

  if (isMarkdown && !isCurrentDirectory) {
    return (
      <Container>
        <ToggleButton
          onClick={() => setIsPreview(prev => !prev)}
          title={isPreview ? 'Edit Markdown' : 'Preview Markdown'}
        >
          {isPreview ? (
            <PenIcon width="16px" height="16px" />
          ) : (
            <EyeIcon width="16px" height="16px" />
          )}
        </ToggleButton>
        {content}
      </Container>
    )
  }

  return content
}

export default Editor
