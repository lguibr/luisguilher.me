import { Container, ArrowIcon, ArrowContainer } from './styled'
import Text from 'src/components/Core/Text'
import { useExtension } from 'src/hooks/useExtension'
import useContextFile from 'src/hooks/useContextFile'

export type FileTileProps = {
  filePath: string
  folder: boolean
  open: boolean
}

const FileTile: React.FC<FileTileProps> = ({ filePath, folder, open }) => {
  const { extractIcon } = useExtension()
  const { files } = useContextFile()
  const file = files.find(file => file.path === filePath)
  const Icon = extractIcon(filePath, open, folder)
  const { diff, isDiff } = file ?? {}

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('file', JSON.stringify(filePath))
  }

  return (
    <Container
      data-tut={
        file?.name?.includes('resume')
          ? 'resume_folder'
          : file?.name === process.env.REPO
          ? 'repo_folder'
          : ''
      }
      draggable={!folder}
      onDragStart={handleDragStart}
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
