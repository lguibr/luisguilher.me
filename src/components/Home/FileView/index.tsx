import useContextFile from 'src/hooks/useContextFile'
import { Container, EditorContainer } from './styled'
import Background from './Background'
import CurrentFileEditor from './CurrentFile'
const FileView: React.FC = () => {
  const { currentFile } = useContextFile()

  return (
    <Container>
      <Background />
      <EditorContainer currentFile={!!currentFile}>
        <CurrentFileEditor />
      </EditorContainer>
    </Container>
  )
}

export default FileView
