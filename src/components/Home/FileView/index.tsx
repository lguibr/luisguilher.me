import { Container, EditorContainer } from './styled'
import Background from './Background'
import CurrentFileEditor from './CurrentFile'
import GuideTour from 'src/components/Core/GuideTour'
import useContextFileView from 'src/hooks/useContextFileView'

const FileView: React.FC<{ id: number }> = ({ id }) => {
  const rootContext = useContextFileView()
  const { findNodeById } = rootContext
  const subTree = findNodeById(id, rootContext)
  if (!subTree) return null
  const { currentFile, openedFiles } = subTree

  return (
    <Container>
      <GuideTour />
      <Background />
      {openedFiles.map(file => (
        <EditorContainer key={file} currentFile={file === currentFile}>
          {file === currentFile && <CurrentFileEditor id={id} />}
        </EditorContainer>
      ))}
    </Container>
  )
}

export default FileView
