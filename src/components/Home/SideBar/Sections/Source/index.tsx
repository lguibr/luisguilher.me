import useContextFile from 'src/hooks/useContextFile'
import RenderDir from './RenderDir'
import Text from 'src/components/Core/Text'
import { Container, Title } from './styled'
const Files: React.FC = () => {
  const { treeFiles } = useContextFile()

  return (
    treeFiles && (
      <Container>
        <Title>
          <Text size={12}>EXPLORER</Text>
        </Title>

        <RenderDir embedded={0} files={treeFiles} />
      </Container>
    )
  )
}

export default Files
