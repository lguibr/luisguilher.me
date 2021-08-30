import Text from 'src/components/Core/Text'
import { Container, Header, Body } from './styled'

export type StepProps = { emoticon: string; title: string; content: string }

const Step: React.FC<StepProps> = ({ emoticon, title, content }) => {
  return (
    <Container>
      <Header>
        <Text as="h1">{emoticon}</Text>
        <Text as="h1">{title}</Text>
      </Header>
      <Body>
        <Text>{content}</Text>
      </Body>
    </Container>
  )
}

export default Step
