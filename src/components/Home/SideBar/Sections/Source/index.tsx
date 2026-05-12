import useContextFile from 'src/hooks/useContextFile'
import RenderDir from './RenderDir'
import Text from 'src/components/Core/Text'

import List from 'public/icons/list.svg'
import Tree from 'public/icons/tree.svg'
import Refresh from 'public/icons/refresh.svg'

import {
  Container,
  Title,
  Row,
  RowClickable,
  IconContainer,
  Ballon,
  ArrowIcon,
  ActionRow,
  ActionButton
} from './styled'
import { buildTree, rebuildPaths } from 'src/utils/treeUtils'

import { FileType } from 'src/contexts/FileContext'
import { useState } from 'react'

const Files: React.FC = () => {
  const { diffFiles, undoAll } = useContextFile()

  const [type, setType] = useState<'tree' | 'list'>('list')
  const [openChanges, setOpenChanges] = useState<boolean>(true)

  const repo = process.env.REPO || 'luisguilher.me'

  const buildRelativeTree = (fileList: FileType[]) => {
    const splittedFiles = rebuildPaths(fileList)
    const absoluteTree = buildTree(splittedFiles)

    const resumeFiles = absoluteTree.filter(({ path }) => path === 'resume')
    const repositoriesFiles = absoluteTree.filter(
      ({ path }) => path === 'repositories'
    )
    const repoFiles = absoluteTree.filter(
      ({ path }) => path !== 'resume' && path !== 'repositories'
    )

    return repoFiles.length
      ? [
          { path: repo, name: repo, children: repoFiles },
          ...resumeFiles,
          ...repositoriesFiles
        ]
      : [...resumeFiles, ...repositoriesFiles]
  }

  const relativeDiffTree = buildRelativeTree(diffFiles)

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
        <RowClickable onClick={() => setOpenChanges(!openChanges)}>
          <Row>
            <ArrowIcon height="10px" width="10px" open={openChanges} />
            <Text size={12}>Changes </Text>
          </Row>
          <Ballon>
            <Text size={12}>{totalChanges} </Text>
          </Ballon>
        </RowClickable>
        {openChanges && diffFiles.length > 0 && (
          <ActionRow>
            <ActionButton
              onClick={undoAll}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Refresh width="10px" height="10px" fill="#fafafa" />
              <Text size={10}>Undo Changes</Text>
            </ActionButton>
          </ActionRow>
        )}
        {openChanges && <RenderDir embedded={0} files={sourceFiles} />}
      </Container>
    )
  )
}

export default Files
