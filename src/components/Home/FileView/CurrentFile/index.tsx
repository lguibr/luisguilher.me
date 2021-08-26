/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'

import useContextFile from 'src/hooks/useContextFile'
import useContextLoading from 'src/hooks/useLoading'
import useExtension from 'src/hooks/useExtension'

import CoreEditor from 'src/components/Core/Editor'

const Editor: React.FC = () => {
  const { extractExtension } = useExtension()
  const { setLoading } = useContextLoading()
  const { currentFile, setContent, setNewContent, setImage } = useContextFile()

  const [currentExt, setCurrentExt] = useState<string>('json')
  const [currentContent, setCurrentContent] = useState<string>('')
  const currentImage = currentFile?.image

  const fetchFileByPath = async (path: string) => {
    setLoading(true)
    const branchSha = process.env.shaBranch
    const filePath = `https://api.github.com/repos/lguibr/luisguilher.me/contents/${path}?ref=${branchSha}`
    const res = await fetch(filePath)
    const data = await res.json()
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
    console.log({ currentFile })
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
    console.log({ selectedLanguage })
    setCurrentExt(selectedLanguage)
  }, [currentFile])

  return (
    <>
      {currentFile && (
        <CoreEditor
          onChange={currentValue => {
            currentFile && setNewContent(currentFile, currentValue || '')
          }}
          currentContent={currentContent}
          currentExt={currentExt}
        />
      )}
      {currentFile?.image && currentImage}
    </>
  )
}
export default Editor
