import { useEffect, useState } from 'react'
import githubService from 'src/services/github'
import useExtension from 'src/hooks/useExtension'
import useContextLoading from 'src/hooks/useLoading'
import useContextFile from 'src/hooks/useContextFile'
import useContextFileView from 'src/hooks/useContextFileView'
import CoreEditor from 'src/components/Core/Editor'
import DiffEditor from 'src/components/Core/DiffEditor'
import { FileType } from 'src/reducers/FileReducer'

const Editor: React.FC<{ id: number }> = ({ id }) => {
  const { fetchFileContent } = githubService
  const { extractExtension } = useExtension()
  const { setLoading } = useContextLoading()

  const { setContent, setNewContent, setImage, files } = useContextFile()

  const rootContext = useContextFileView()
  const { findNodeById } = rootContext
  const subTree = findNodeById(id, rootContext)
  if (!subTree) return null
  const { currentFile } = subTree

  const [currentContent, setCurrentContent] = useState('')

  const currentFileData = files.find(file => file.path === currentFile)

  const handleFetchFileContent = async (fileData: FileType, path: string) => {
    setLoading(true)
    const data = await fetchFileContent(path)
    const isImage = /\.(png|jpg|jpeg|ico)$/i.test(path)

    if (isImage) {
      if (!fileData.image) {
        const imageElement = (
          <div
            style={{
              position: 'absolute',
              top: '0%',
              left: '0%',
              height: '100%',
              width: '100%',
              zIndex: 9,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              placeholder="blur"
              src={` data:image/jpeg;charset=utf-8;base64, ${data.content}`}
            />
          </div>
        )
        setImage(fileData, imageElement)
      }
    } else {
      const rawFile = decodeURIComponent(escape(window.atob(data.content)))
      setContent(fileData, rawFile)
      setCurrentContent(rawFile) // Set content directly here to avoid extra re-render
    }
    setLoading(false) // Set loading to false once the content is fetched and set
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
      setCurrentContent(currentFileData.content || '')
    }
  }, [currentFileData, currentFile])

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
