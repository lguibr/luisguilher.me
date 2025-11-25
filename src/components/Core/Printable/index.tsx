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
            {curriculum?.content || 'Curriculum content not found. Please reload the page.'}
          </ReactMarkdown>
        </MarkdownWrapper>
      </Content>
    </Container>
  )
}
export default Printable

const MarkdownWrapper = styled.div`
  @media print {
    @page {
      margin: 12mm 15mm;
      size: auto;
    }
    body {
      -webkit-print-color-adjust: exact;
      background-color: white;
    }
    * {
      visibility: visible !important;
    }
  }

  color: #000000;
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 10.5pt;
  line-height: 1.45;
  width: 100%;
  max-width: 100%;

  /* Header Section (Name & Contact) */
  h1 {
    font-size: 22pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
    margin-top: 0;
    color: #000;
    border: none;
    text-align: center;
  }

  /* Subtitle / Role */
  p:first-of-type strong {
    font-size: 11pt;
    font-weight: 600;
  }

  /* Section Headings */
  h2 {
    font-size: 12pt;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 1px solid #000;
    padding-bottom: 3px;
    margin-top: 18px;
    margin-bottom: 10px;
    page-break-after: avoid;
    color: #000;
    letter-spacing: 0.5px;
  }

  /* Job Titles / Sub-headings */
  h3 {
    font-size: 11pt;
    font-weight: 700;
    margin-top: 12px;
    margin-bottom: 4px;
    page-break-after: avoid;
    color: #000;
    display: flex;
    justify-content: space-between;
  }

  /* Body Text */
  p {
    margin-bottom: 6px;
    orphans: 3;
    widows: 3;
    text-align: left;
  }

  /* Lists */
  ul {
    padding-left: 18px;
    margin-bottom: 8px;
    margin-top: 4px;
  }
  li {
    margin-bottom: 3px;
    padding-left: 2px;
  }

  /* Links */
  a {
    color: #000;
    text-decoration: none;
    font-weight: 500;
  }
  
  /* Horizontal Rules */
  hr {
    border: 0;
    border-top: 1px solid #000;
    margin: 15px 0;
    display: none; /* Hide HRs in print to save space if using H2 borders */
  }

  /* Bold & Italic */
  strong {
    font-weight: 700;
  }
  em {
    font-style: italic;
  }

  /* Contact Info Formatting (assuming it's in the first few lines) */
  p:nth-of-type(1), p:nth-of-type(2), p:nth-of-type(3) {
    text-align: center;
    margin-bottom: 2px;
  }
`
