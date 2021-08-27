import { FileType } from 'src/contexts/FileContext'
import { Container, ArrowIcon, ArrowContainer, Span } from './styled'
import Text from 'src/components/Core/Text'
import { useExtension } from 'src/hooks/useExtension'

export type FileTileProps = {
  file: FileType
  folder: boolean
  open: boolean
}

const FileTile: React.FC<FileTileProps> = ({ file, folder, open }) => {
  const { extractIcon } = useExtension()
  const Icon = extractIcon(file, open)
  const { diff } = file
  return (
    <Container>
      <ArrowContainer>
        {folder && <ArrowIcon height="10px" width="10px" open={open} />}
      </ArrowContainer>
      <Icon height="14px" width="14px" />
      <Text size={14}>{file?.name}</Text>
      {diff && <Text size={13}>M</Text>}
    </Container>
  )
}

export default FileTile
