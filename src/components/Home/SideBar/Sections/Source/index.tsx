import useContextFile from 'src/hooks/useContextFile'
import RenderDir from './RenderDir'
import Text from 'src/components/Core/Text'
import { Container, Title } from './styled'
const Files: React.FC = () => {
  const { files } = useContextFile()

  const diffFiles = files.filter(({ diff }) => diff)

  console.log({ diffFiles })

  return (
    diffFiles && (
      <Container>
        <Title>
          <Text size={12}>EXPLORER</Text>
        </Title>

        <RenderDir embedded={0} files={diffFiles} />
      </Container>
    )
  )
}

export default Files
