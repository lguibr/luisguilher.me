import { useState } from 'react'
import { RealContainer, Container, Children, File } from './styled'
import FileTile from 'src/components/Core/TileFile'
import { FileType } from 'src/contexts/FileContext'
import useContextFileView from 'src/hooks/useContextFileView'
import useContextFile from 'src/hooks/useContextFile'

export type RenderDirectoryProps = {
  files: FileType[]
  embedded: number
}

const RenderDirectory: React.FC<RenderDirectoryProps> = ({
  files,
  embedded = 0
}) => {
  const { currentFile, openFile } = useContextFileView()
  const { focusedFileView } = useContextFile()
  const openState = Object.fromEntries(files.map(({ path }) => [[path], true]))

  const [open, setOpen] = useState(openState)

  const handleClick = (file: FileType) => {
    const isFile = !file?.children?.length

    if (isFile) {
      openFile(file.path, focusedFileView)
    }

    setOpen((prevOpen: { [key: string]: boolean }) => ({
      ...prevOpen,
      [file?.path]: !prevOpen[file?.path]
    }))
  }
  return (
    <RealContainer embedded={embedded}>
      {!!files.length &&
        files.map(file => (
          <Container
            embedded={embedded}
            isHighLighted={file?.path === currentFile}
            key={file.path}
          >
            <File
              embedded={embedded}
              isHighLighted={file?.path === currentFile}
            >
              <div onClick={() => handleClick(file)}>
                <FileTile
                  folder={!!file?.children?.length}
                  open={open[file?.path]}
                  filePath={file?.path}
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
