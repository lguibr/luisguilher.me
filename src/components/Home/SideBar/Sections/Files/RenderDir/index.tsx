// File: src/components/Home/SideBar/Sections/Files/RenderDir/index.tsx
import { useState, useCallback } from 'react'
import useContextFileView from 'src/hooks/useContextFileView'
import { RealContainer, Container, Children, File } from './styled'
import FileTile from 'src/components/Core/TileFile'
import { FileType } from 'src/contexts/FileContext'
import useContextFile from 'src/hooks/useContextFile'
import useContextLoading from 'src/hooks/useLoading'
import useContextSidebar from 'src/hooks/useSideBar'

export type RenderDirectoryProps = {
  files: FileType[]
  embedded: number
}

const RenderDirectory: React.FC<RenderDirectoryProps> = ({
  files,
  embedded = 0
}) => {
  const { focusedFileView, focusedFile, fetchAndMergeRepoTree } =
    useContextFile()
  const { openFile } = useContextFileView()
  const { setOpen: setSideBarOpen } = useContextSidebar()
  const { setLoading } = useContextLoading()

  const [open, setOpen] = useState<{ [key: string]: boolean }>({})

  const handleClick = useCallback(
    async (file: FileType) => {
      const isDirectory =
        file.type === 'tree' ||
        file.type === 'repo-root' ||
        file.type === 'placeholder-repo-root'
      const isFile = !isDirectory

      if (isFile) {
        openFile(file.path, focusedFileView)
        setSideBarOpen(false)
        return
      }

      // --- Directory Handling ---
      // Needs fetching if children is undefined (and it's a placeholder type)
      const needsFetching =
        file.children === undefined && file.type === 'placeholder-repo-root'

      // Always toggle the visual state first
      setOpen(prevOpen => ({ ...prevOpen, [file.path]: !prevOpen[file.path] }))

      // Fetch if needed (and not the main 'repositories' folder itself)
      if (needsFetching && file.name && file.path !== 'repositories') {
        setLoading(true)
        try {
          await fetchAndMergeRepoTree(file.name)
          // No need to setOpen again, context update triggers re-render
        } catch (e) {
          console.error(`[RenderDir] Error fetching ${file.name}`, e)
          // Revert open state on error?
          setOpen(prevOpen => ({ ...prevOpen, [file.path]: false }))
        } finally {
          setLoading(false)
        }
      }
    },
    [
      focusedFileView,
      openFile,
      setSideBarOpen,
      fetchAndMergeRepoTree,
      setLoading
    ]
  )

  return (
    <RealContainer embedded={embedded}>
      {!!files.length &&
        files.map(file => {
          const isDirectoryType =
            file.type === 'tree' ||
            file.type === 'repo-root' ||
            file.type === 'placeholder-repo-root'
          // Children are loaded if the children property is an array
          const hasLoadedChildren = Array.isArray(file.children)
          // Needs fetching if placeholder and children is undefined
          const needsFetching =
            file.type === 'placeholder-repo-root' && file.children === undefined

          return (
            <Container
              embedded={embedded}
              isHighLighted={
                file?.path === focusedFile ||
                (focusedFile &&
                  hasLoadedChildren &&
                  file.children.length > 0 &&
                  focusedFile.startsWith(file.path + '/'))
              }
              key={file.path}
            >
              <File embedded={embedded}>
                <div onClick={() => handleClick(file)}>
                  <FileTile
                    folder={isDirectoryType || hasLoadedChildren}
                    open={open[file.path] ?? false}
                    filePath={file.path}
                  />
                </div>
              </File>
              {/* Render Children wrapper only if children data is loaded (is an array) */}
              {hasLoadedChildren && (
                <Children embedded={embedded} opened={open[file.path] ?? false}>
                  {/* Render recursive component only if children array has items */}
                  {file.children && file.children.length > 0 && (
                    <RenderDirectory
                      embedded={embedded + 1}
                      files={file.children}
                    />
                  )}
                  {/* Optional: Show empty message */}
                  {/* {file.children && file.children.length === 0 && <div>(empty)</div>} */}
                </Children>
              )}
              {/* Show loading indicator if opened visually, but data hasn't arrived yet */}
              {needsFetching && open[file.path] && !hasLoadedChildren && (
                <Children embedded={embedded} opened={true}>
                  <div>Loading...</div>
                </Children>
              )}
            </Container>
          )
        })}
    </RealContainer>
  )
}

export default RenderDirectory
