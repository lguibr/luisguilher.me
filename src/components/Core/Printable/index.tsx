import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Container, Content } from './styled'
import { useContextFile } from 'src/hooks/useContextFile'
import styled from 'styled-components'

export type PrintableProps = {
  printRef: React.MutableRefObject<null>
}

const Printable: React.FC<PrintableProps> = ({ printRef }) => {
  const { files } = useContextFile()
  const curriculum = files.find(file => file.name === 'CURRICULUM.md')

  return (
    <Container ref={printRef}>
      <Content>
        <MarkdownWrapper>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {curriculum?.content || ''}
          </ReactMarkdown>
        </MarkdownWrapper>
      </Content>
    </Container>
  )
}
export default Printable

const MarkdownWrapper = styled.div`
  color: black;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  line-height: 1.5;

  h1 {
    font-size: 24px;
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }
  h2 {
    font-size: 18px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 3px;
    margin-top: 15px;
    margin-bottom: 8px;
  }
  h3 {
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  p {
    margin-bottom: 8px;
  }
  ul {
    padding-left: 20px;
    margin-bottom: 8px;
  }
  li {
    margin-bottom: 2px;
  }
  a {
    color: #000;
    text-decoration: none;
  }
`
