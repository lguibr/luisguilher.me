import Text from 'src/components/Core/Text'
import { Container, Img, Content } from './styled'
import { useContextFile } from 'src/hooks/useContextFile'
export type PrintableProps = {
  printRef: React.MutableRefObject<null>
}

const Printable: React.FC<PrintableProps> = ({ printRef }) => {
  const { files } = useContextFile()
  const resume = files.find(file => file.path.includes('-resume'))
  return (
    <Container>
      <div ref={printRef}>
        <Content>
          <Img height="120px" width="120px" src="./profisionalProfile.png" />
          <Text as="pre" size={12} color="black">
            {resume?.content}
          </Text>
        </Content>
      </div>
    </Container>
  )
}
export default Printable
