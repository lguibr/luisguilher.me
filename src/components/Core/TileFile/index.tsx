import { FileType } from 'src/contexts/FileContext'
import { Container, ArrowIcon, ArrowContainer } from './styled'
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
  const { diff, isDiff } = file
  return (
    <Container
      data-tut={
        file?.name === 'resume'
          ? 'resume_folder'
          : file?.name === process.env.REPO
          ? 'repo_folder'
          : ''
      }
    >
      <ArrowContainer>
        {folder && <ArrowIcon height="10px" width="10px" open={open} />}
      </ArrowContainer>
      <Icon height="14px" width="14px" />
      <Text size={14}>{file?.name}</Text>
      {isDiff && <Text size={13}>(Working Tree)</Text>}
      {diff && <Text size={13}>M</Text>}
    </Container>
  )
}

export default FileTile
