import DragDropComponent from 'src/components/Core/DragDrop'
import useContextFileView from 'src/hooks/useContextFileView'
import { FileContainer, Main } from '../styled'
import Navigation from '../Navigation'
import Loading from 'src/components/Core/Loading'
import FileView from '../FileView'
import SplittableContainer from 'src/components/Core/Splittable'
import { FileViewsContextType, Orientation } from 'src/contexts/FileViewContext'
import { useEffect } from 'react'
import useContextFile from 'src/hooks/useContextFile'

interface FileViewComponentProps {
  depth?: number
  id: number
}

const FileViewComponent: React.FC<FileViewComponentProps> = ({
  depth = 0,
  id = 0
}) => {
  const rootContext = useContextFileView()
  const { findNodeById } = rootContext
  const subTree = findNodeById(id, rootContext)
  if (!subTree) return null
  const {
    children: childContext,
    openFile,
    createChild,
    orientation,
    setOrientation
  } = subTree

  const { setFocusedFileView } = useContextFile()

  const onPosition = (
    position: Orientation | 'center' | null,
    file: string
  ) => {
    const isNotEmpty =
      rootContext.children.length > 0 || rootContext.openedFiles.length > 0

    if (!position || position === 'center') {
      openFile(file, id)
    } else if (isNotEmpty) {
      createChild(file, position, id)
      setOrientation(position, id)
    } else {
      openFile(file, id)
    }
  }

  const initialFileview = (
    <DragDropComponent onPosition={onPosition}>
      <Main
        onClick={() => {
          setFocusedFileView(id)
        }}
        onDragEnd={() => {
          setFocusedFileView(id)
        }}
      >
        <Navigation id={id} />
        <FileContainer>
          <Loading />
          <FileView id={id} />
        </FileContainer>
      </Main>
    </DragDropComponent>
  )

  const renderChildren = (childrenContext: FileViewsContextType[]) => {
    return (
      <FileViewComponent
        key={childrenContext[0].id}
        depth={depth + 1}
        id={childrenContext[0].id}
      />
    )
  }

  useEffect(() => {
    setFocusedFileView(id)
  }, [])

  // Determine direction based on orientation
  const direction =
    orientation === 'right' || orientation === 'left'
      ? 'horizontal'
      : 'vertical'

  const firstChild = initialFileview
  const secondChild =
    childContext && childContext.length > 0
      ? renderChildren(childContext)
      : undefined

  const shouldSwap = orientation === 'right' || orientation === 'bottom'
  return (
    <>
      <SplittableContainer
        direction={direction}
        id={depth}
        targetView={shouldSwap ? secondChild ?? null : firstChild ?? null}
        newView={shouldSwap ? firstChild ?? null : secondChild ?? null}
      />
    </>
  )
}

export default FileViewComponent
