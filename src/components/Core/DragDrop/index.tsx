import { useState, useEffect } from 'react'
import { HighlightPosition, Container } from './styled'

interface DragDropComponentProps {
  onPosition?: (position: HighlightPosition, file: string) => void
  children: React.ReactNode
}

const DragDropComponent: React.FC<DragDropComponentProps> = ({
  onPosition,
  children
}) => {
  const [highlightPosition, setHighlightPosition] =
    useState<HighlightPosition>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedFile, setDraggedFile] = useState<string | null>(null)

  useEffect(() => {
    if (isDragging && draggedFile) {
      const handleDragEnd = () => {
        if (onPosition) {
          onPosition(highlightPosition, draggedFile)
        }
        setHighlightPosition(null)
        setIsDragging(false)
        setDraggedFile(null)
      }

      document.addEventListener('dragend', handleDragEnd)
      return () => {
        document.removeEventListener('dragend', handleDragEnd)
      }
    }
  }, [isDragging, onPosition, highlightPosition, draggedFile])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isDragging) {
      setIsDragging(true)
    }
    updateHighlightPosition(e)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    updateHighlightPosition(e)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setHighlightPosition(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const fileData = JSON.parse(e.dataTransfer.getData('file')) as string
    setDraggedFile(fileData)
  }

  const updateHighlightPosition = (e: React.DragEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()

    // Calculate relative position (0 to 1)
    const relX = (clientX - left) / width
    const relY = (clientY - top) / height

    const threshold = 0.25
    let newPosition: HighlightPosition

    if (relX < threshold) {
      newPosition = 'left'
    } else if (relX > 1 - threshold) {
      newPosition = 'right'
    } else if (relY < threshold) {
      newPosition = 'top'
    } else if (relY > 1 - threshold) {
      newPosition = 'bottom'
    } else {
      newPosition = 'center'
    }

    setHighlightPosition(newPosition)
  }

  return (
    <Container
      highlight={highlightPosition}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </Container>
  )
}

export default DragDropComponent
