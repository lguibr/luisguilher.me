import Text from 'src/components/Core/Text'
import { Container, Img, Content } from './styled'
import { useContextFile } from 'src/hooks/useContextFile'
import styled from 'styled-components'

export type PrintableProps = {
  printRef: React.MutableRefObject<null>
}

const Printable: React.FC<PrintableProps> = ({ printRef }) => {
  const { files } = useContextFile()
  const resume = files.find(file => file.path.includes('-resume'))
  return (
    <Container ref={printRef}>
      <Content>
        <Img height="100px" width="100px" src="./profisionalProfile.png" />
        <Pre as="pre">{resume?.content}</Pre>
      </Content>
    </Container>
  )
}
export default Printable

const Pre = styled(Text)`
  color: black;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 15px;
  font-family: 'Roboto', sans-serif;
`
