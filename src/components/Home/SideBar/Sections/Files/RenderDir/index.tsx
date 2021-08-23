import { useState } from 'react'
import useContextFile from 'src/hooks/useContextFile'
import { RealContainer, Container, Children, File } from './styled'
import FileTile from 'src/components/Core/TileFile'
import { File as FileType } from 'src/contexts/FileContext'

export type RenderDirectoryProps = {
  files: FileType[]
  embedded: number
}

const RenderDirectory: React.FC<RenderDirectoryProps> = ({
  files,
  embedded = 0
}) => {
  const resumeName = process.env.RESUME || 'resume'

  const { highLighted, openFile } = useContextFile()

  const openState = Object.fromEntries(
    files.map(({ path }) => [[path], path === resumeName])
  )

  const [open, setOpen] = useState(openState)

  const handleClick = (file: FileType) => {
    const isFile = !file?.children?.length

    isFile && openFile(file)

    setOpen({ ...open, [file?.path]: !open[file?.path] })
  }
  return (
    <RealContainer embedded={embedded}>
      {!!files.length &&
        files.map(file => (
          <Container
            embedded={embedded}
            isHighLighted={file?.name === highLighted?.name}
            key={file.path}
          >
            <File
              embedded={embedded}
              isHighLighted={file?.name === highLighted?.name}
            >
              <div onClick={() => handleClick(file)}>
                <FileTile
                  folder={!!file?.children?.length}
                  open={open[file?.path]}
                  file={file}
                />
              </div>
            </File>
            <Children embedded={embedded} opened={open[file?.path]}>
              {file?.children && (
                <RenderDirectory
                  embedded={embedded + 1}
                  files={file?.children}
                />
              )}
            </Children>
          </Container>
        ))}
    </RealContainer>
  )
}

export default RenderDirectory
