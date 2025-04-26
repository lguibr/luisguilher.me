import { useEffect, useState } from 'react'
import githubService from 'src/services/github'
import useExtension from 'src/hooks/useExtension'
import useContextLoading from 'src/hooks/useLoading'
import useContextFile from 'src/hooks/useContextFile'
import useContextFileView from 'src/hooks/useContextFileView'
import CoreEditor from 'src/components/Core/Editor'
import DiffEditor from 'src/components/Core/DiffEditor'
import { FileType } from 'src/reducers/FileReducer'
import Image from 'next/image' // Import next/image

const Editor: React.FC<{ id: number }> = ({ id }) => {
  const { fetchFileContent } = githubService
  const { extractExtension } = useExtension()
  const { setLoading } = useContextLoading() // Only need setLoading

  const { setContent, setNewContent, setImage, files } = useContextFile()

  const rootContext = useContextFileView()
  const { findNodeById } = rootContext
  const subTree = findNodeById(id, rootContext)
  if (!subTree) return null
  const { currentFile } = subTree

  const [currentContent, setCurrentContent] = useState('')

  const currentFileData = files.find(file => file.path === currentFile)

  const handleFetchFileContent = async (fileData: FileType, path: string) => {
    console.log(`[CurrentFile] Fetching content for: ${path}`)
    setLoading(true) // Start loading, context will pick random sketch
    try {
      const data = await fetchFileContent(path)
      const isImage = /\.(png|jpg|jpeg|ico)$/i.test(path)

      if (isImage) {
        if (!fileData.image) {
          const imageSrc = `data:image/jpeg;charset=utf-8;base64,${data.content}`
          const imageElement = (
            <div
              style={{
                position: 'relative', // Changed to relative for next/image layout="fill"
                width: '100%', // Ensure container takes space
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px' // Add padding around image
              }}
            >
              <Image
                src={imageSrc}
                alt={`Image for ${fileData.name}`}
                layout="intrinsic" // Adjust layout as needed
                width={500} // Provide estimated or max width
                height={500} // Provide estimated or max height
                objectFit="contain" // Ensure image fits within bounds
              />
            </div>
          )
          setImage(fileData, imageElement)
        }
      } else {
        const rawFile = decodeURIComponent(escape(window.atob(data.content)))
        setContent(fileData, rawFile)
        setCurrentContent(rawFile)
      }
    } catch (error) {
      console.error(`[CurrentFile] Error fetching content for ${path}:`, error)
      // Optionally set an error state or display a message
    } finally {
      console.log(`[CurrentFile] Finished loading content for: ${path}`)
      setLoading(false) // Stop loading, context will clear sketch name
    }
  }

  useEffect(() => {
    if (
      currentFileData &&
      !currentFileData.content &&
      !currentFileData.image &&
      currentFileData.path
    ) {
      handleFetchFileContent(currentFileData, currentFileData.path)
    } else if (
      currentFileData &&
      (currentFileData.content || currentFileData.image)
    ) {
      // If content/image already exists, ensure loading is false
      setLoading(false)
      setCurrentContent(currentFileData.content || '')
    } else if (!currentFileData && currentFile) {
      // Handle case where file data might not be found initially
      console.warn(`[CurrentFile] File data not found for path: ${currentFile}`)
      setLoading(false) // Ensure loading stops if file isn't found
    } else if (!currentFile) {
      // No file selected, ensure loading is off
      setLoading(false)
    }
  }, [currentFileData, currentFile, setLoading, setContent, setImage]) // Added missing dependencies

  const currentExt = extractExtension(currentFileData?.path || 'default.json')

  return (
    <>
      {currentFile && currentFileData && !currentFileData.image && (
        <>
          {!currentFileData.isDiff ? (
            <CoreEditor
              onChange={currentValue =>
                setNewContent(currentFileData, currentValue || '')
              }
              currentContent={currentContent}
              currentExt={currentExt}
            />
          ) : (
            <DiffEditor
              currentContent={currentFileData.content || ''}
              currentNewContent={currentFileData.newContent || ''}
              currentExt={currentExt}
            />
          )}
        </>
      )}
      {currentFileData?.image}
    </>
  )
}

export default Editor
