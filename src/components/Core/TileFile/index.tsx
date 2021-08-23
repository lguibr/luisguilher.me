import { File as FileType } from 'src/contexts/FileContext'
import { Container, ArrowIcon, ArrowContainer } from './styled'
import Text from 'src/components/Core/Text'

import TypescriptIcon from 'public/icons/typescript.svg'
import TypescriptAltIcon from 'public/icons/typescript-outlined.svg'
import EslintIcon from 'public/icons/eslint.svg'
import BabelIcon from 'public/icons/babel.svg'
import ImageIcon from 'public/icons/file-image-solid.svg'
import FolderIcon from 'public/icons/folder-solid.svg'
import OpenFolderIcon from 'public/icons/folder-open-solid.svg'
import GitIcon from 'public/icons/git-icon.svg'
import JSONIcon from 'public/icons/json.svg'
import JavascriptIcon from 'public/icons/javascript.svg'
import PrettierIcon from 'public/icons/prettier.svg'
import ReactIcon from 'public/icons/react.svg'
import YarnIcon from 'public/icons/yarn.svg'
import NodeIcon from 'public/icons/nodejs.svg'
import FileIcon from 'public/icons/file.svg'

export type FileTileProps = {
  file: FileType
  folder: boolean
  open: boolean
}

const FileTile: React.FC<FileTileProps> = ({ file, folder, open }) => {
  const icons = [
    { expression: 'package.json', icon: NodeIcon },
    { expression: 'git', icon: GitIcon },
    { expression: 'eslint', icon: EslintIcon },
    { expression: 'babel', icon: BabelIcon },
    { expression: 'yarn', icon: YarnIcon },
    { expression: 'prettier', icon: PrettierIcon },
    { expression: '.d.ts', icon: TypescriptAltIcon },
    { expression: '.json', icon: JSONIcon },
    { expression: /.(t|j)sx/, icon: ReactIcon },
    { expression: '.js', icon: JavascriptIcon },
    { expression: '.ts', icon: TypescriptIcon },
    { expression: /.png|.jpg|.svg/, icon: ImageIcon },
    { expression: /./, icon: FileIcon },
    { expression: /./, icon: OpenFolderIcon },
    { expression: /./, icon: FolderIcon }
  ]

  const IconByExtensionMatch = icons.find(({ expression }) =>
    file?.name?.match(expression)
  )

  const selectedIcon = folder
    ? open
      ? OpenFolderIcon
      : FolderIcon
    : IconByExtensionMatch?.icon

  const Icon = selectedIcon || FileIcon

  return (
    <Container>
      <ArrowContainer>
        {folder && <ArrowIcon height="10px" width="10px" open={open} />}
      </ArrowContainer>
      <Icon height="14px" width="14px" />
      <Text size={14}>{file?.name}</Text>
    </Container>
  )
}

export default FileTile
