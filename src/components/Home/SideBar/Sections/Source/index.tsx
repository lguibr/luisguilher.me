import useContextFile from 'src/hooks/useContextFile'
import RenderDir from './RenderDir'
import Text from 'src/components/Core/Text'

import List from 'public/icons/list.svg'
import Tree from 'public/icons/tree.svg'

import {
  Container,
  Title,
  Row,
  RowClickable,
  IconContainer,
  Ballon,
  ArrowIcon
} from './styled'
import { useTree } from 'src/hooks/useTree'

import { FileType } from 'src/contexts/FileContext'
import { useState } from 'react'

const Files: React.FC = () => {
  const { build, rebuildPaths } = useTree()
  const { diffFiles } = useContextFile()

  const [type, setType] = useState<'tree' | 'list'>('list')
  const [open, setOpen] = useState<boolean>(true)

  const repo = process.env.REPO || 'luisguilher.me'
  const splittedDiffFiles = rebuildPaths(diffFiles)
  const absoluteDiffTree = build(splittedDiffFiles)

  const resumeFiles = absoluteDiffTree.filter(({ path }) => path === 'resume')
  const repoFiles = absoluteDiffTree.filter(({ path }) => path !== 'resume')

  const relativeDiffTree: FileType[] = repoFiles.length
    ? [{ path: repo, name: repo, children: repoFiles }, ...resumeFiles]
    : [...resumeFiles]

  const sourceFiles = type === 'tree' ? relativeDiffTree : diffFiles
  const totalChanges = JSON.stringify(diffFiles.length || 0)

  const toggleTypeList = () => {
    setType(type === 'list' ? 'tree' : 'list')
  }

  return (
    sourceFiles && (
      <Container>
        <Row>
          <Title>
            <Text size={12}>SOURCE CONTROL</Text>
          </Title>
          <IconContainer onClick={toggleTypeList}>
            {type === 'list' ? <Tree /> : <List />}
          </IconContainer>
        </Row>
        <RowClickable onClick={() => setOpen(!open)}>
          <Row>
            <ArrowIcon height="10px" width="10px" open={open} />
            <Text size={12}>Changes </Text>
          </Row>
          <Ballon>
            <Text size={12}>{totalChanges} </Text>
          </Ballon>
        </RowClickable>
        {open && <RenderDir embedded={0} files={sourceFiles} />}
      </Container>
    )
  )
}

export default Files
