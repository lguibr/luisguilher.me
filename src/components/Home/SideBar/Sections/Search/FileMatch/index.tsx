import { MatchHeader, Match, Container, MatchBody, ArrowIcon } from './styled'
import Text from 'src/components/Core/Text'
import FileTile from 'src/components/Core/TileFile'
import FormattedLabel from './FormattedLabel'
import { FileType } from 'src/contexts/FileContext'
import useContextFile from 'src/hooks/useContextFile'
import { useState } from 'react'
export type FileMatchProps = {
  path: string
  query: string
  lines: string[] | string | undefined
  file: FileType
  i: number
}

const FileMatch: React.FC<FileMatchProps> = ({
  path,
  lines,
  file,
  i,
  query
}) => {
  const { openFile } = useContextFile()
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
        <FileTile folder={false} open={false} file={file} />
        <Text as="pre" color="subString" size={13}>
          {path}
        </Text>
      </MatchHeader>
      <MatchBody onClick={() => openFile(file)}>
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
