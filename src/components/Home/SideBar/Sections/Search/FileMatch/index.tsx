import { MatchHeader, Match, Container, MatchBody, ArrowIcon } from './styled'
import Text from 'src/components/Core/Text'
import FileTile from 'src/components/Core/TileFile'
import FormattedLabel from './FormattedLabel'
import { useState } from 'react'
import useContextFileView from 'src/hooks/useContextFileView'
import useContextFile from 'src/hooks/useContextFile'
export type FileMatchProps = {
  path: string
  query: string
  lines: string[] | string | undefined
  file: string
  i: number
}

const FileMatch: React.FC<FileMatchProps> = ({
  path,
  lines,
  file,
  i,
  query
}) => {
  const { focusedFileView } = useContextFile()
  const { openFile } = useContextFileView()
  const [open, setOpen] = useState(true)
  return (
    <Container>
      <MatchHeader
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div>
          <ArrowIcon open={open} />
        </div>
        <FileTile folder={false} open={false} filePath={file} />
        <Text as="pre" color="subString" size={13}>
          {path}
        </Text>
      </MatchHeader>
      <MatchBody onClick={() => openFile(file, focusedFileView)}>
        {open &&
          lines?.length &&
          typeof lines !== 'string' &&
          lines.map((line, j) => (
            <Match key={i + j}>
              <Text size={12}>
                <FormattedLabel label={line} value={query} />
              </Text>
            </Match>
          ))}
      </MatchBody>
    </Container>
  )
}

export default FileMatch
