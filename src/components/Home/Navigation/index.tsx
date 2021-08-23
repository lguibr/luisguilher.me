import { Container, Row, Close } from './styled'
import useContextFile from 'src/hooks/useContextFile'
import FileTile from 'src/components/Core/TileFile'
import CloseIcon from 'public/icons/close-line.svg'

const Navigation: React.FC = () => {
  const { openedFiles, currentFile, openFile, closeFile } = useContextFile()

  return (
    <Container>
      {openedFiles.map(file => (
        <Row
          isCurrent={file?.name === currentFile?.name}
          onClick={() => openFile(file)}
          key={file.path}
        >
          <FileTile folder={false} open={false} file={file} />
          <Close
            onClick={e => {
              e.stopPropagation()
              closeFile(file)
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
