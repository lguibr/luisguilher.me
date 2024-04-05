import { Container, Row, Close } from './styled'
import useContextFileView from 'src/hooks/useContextFileView'
import FileTile from 'src/components/Core/TileFile'
import CloseIcon from 'public/icons/close-line.svg'

const Navigation: React.FC<{ id: number }> = ({ id }) => {
  const rootContext = useContextFileView()
  const { findNodeById } = rootContext

  const subTree = findNodeById(id, rootContext)
  if (!subTree) return null
  const { openedFiles, currentFile, openFile, closeFile } = subTree

  return (
    <Container>
      {openedFiles?.map(file => (
        <Row
          isCurrent={file === currentFile}
          onClick={() => {
            openFile(file, id)
          }}
          key={file}
        >
          <FileTile folder={false} open={false} filePath={file} />
          <Close
            onClick={e => {
              e.stopPropagation()
              closeFile(file, id)
            }}
          >
            <CloseIcon />
          </Close>
        </Row>
      ))}
    </Container>
  )
}

export default Navigation
