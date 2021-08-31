/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import githubService from 'src/services/github'
import useContextFile from 'src/hooks/useContextFile'
import useContextLoading from 'src/hooks/useLoading'
import useExtension from 'src/hooks/useExtension'

import CoreEditor from 'src/components/Core/Editor'
import DiffEditor from 'src/components/Core/DiffEditor'

const Editor: React.FC = () => {
  const { fetchFileContent } = githubService
  const { extractExtension } = useExtension()
  const { setLoading } = useContextLoading()
  const { currentFile, setContent, setNewContent, setImage } = useContextFile()

  const [currentExt, setCurrentExt] = useState<string>('json')
  const [currentContent, setCurrentContent] = useState<string>('')
  const currentImage = currentFile?.image

  const fetchFileByPath = async (path: string) => {
    setLoading(true)
    const data = await fetchFileContent(path)
    const regex = /\.png|\.jpg|\.jpeg|\.ico/gi
    const currentImage = currentFile?.image
    if (regex.test(path)) {
      currentFile &&
        !currentImage &&
        setImage(
          currentFile,
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
              src={`data:image/png;base64, ${data.content}`}
            />
          </div>
        )
    } else {
      const rawFile = await decodeURIComponent(
        escape(window.atob(data.content))
      )
      currentFile && setContent(currentFile, rawFile)
    }
  }

  useEffect(() => {
    if (currentContent || currentFile?.image) {
      const debounce = setTimeout(() => {
        const shouldStopLoading = currentContent || currentFile?.image
        shouldStopLoading && setLoading(false)
      }, 1500)
      return () => clearTimeout(debounce)
    }
  }, [currentContent, currentImage])

  useEffect(() => {
    const currentContent = currentFile?.content
    const currentNewContent = currentFile?.newContent
    const currentPath = currentFile?.path
    if (currentContent || currentImage) {
      currentContent && setCurrentContent(currentNewContent || currentContent)
      currentImage && setCurrentContent('')
    } else if (currentPath && (!currentFile?.content || !currentFile?.image)) {
      fetchFileByPath(currentPath)
    }
  }, [currentFile])

  useEffect(() => {
    const selectedLanguage = currentFile
      ? extractExtension(currentFile)
      : 'json'
    setCurrentExt(selectedLanguage)
  }, [currentFile])

  return (
    <>
      {currentFile && (
        <>
          {!currentFile.isDiff ? (
            <CoreEditor
              onChange={currentValue => {
                currentFile && setNewContent(currentFile, currentValue || '')
              }}
              currentContent={currentContent}
              currentExt={currentExt}
              path={currentFile.path}
            />
          ) : (
            <DiffEditor
              currentContent={currentFile?.content || ''}
              currentNewContent={currentFile?.newContent || ''}
              currentExt={currentExt}
              path={currentFile.path}
            />
          )}
        </>
      )}
      {currentFile?.image && currentImage}
    </>
  )
}
export default Editor
