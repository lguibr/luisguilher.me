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
import YamlIcon from 'public/icons/yaml.svg'
import NodeIcon from 'public/icons/nodejs.svg'
import FileIcon from 'public/icons/file.svg'
import React from 'react'
import useContextFile from './useContextFile'

export type useExtension = {
  extractIcon: (
    file: string,
    open: boolean,
    folder: boolean
  ) => React.FC<{ height: string; width: string }>
  extractExtension: (file: string) => string
}

export const useExtension = (): useExtension => {
  const extractExtension = (file: string): string => {
    const splittedPath = file?.split('.')
    const ext = !!splittedPath?.length && splittedPath[splittedPath.length - 1]

    const languages = [
      {
        name: 'json',
        regex: /lock|json/
      },
      {
        name: 'javascript',
        regex: /js/
      },
      {
        name: 'typescript',
        regex: /ts/
      },
      {
        name: 'yaml',
        regex: /editorconfig|Dockerfile|yaml|yml|gitignore/
      },
      {
        name: 'markdown',
        regex: /\.md/
      },
      {
        name: 'html',
        regex: /html/
      },
      {
        name: 'xml',
        regex: /xml|svg/
      }
    ]

    const selectedLanguage =
      languages.find(({ regex }) => ext && ext.match(regex))?.name || 'json'

    return selectedLanguage
  }

  const extractIcon = (
    path: string,
    open: boolean,
    folder: boolean
  ): React.FC => {
    const { files } = useContextFile()
    const file = files.find(file => file.path === path)
    const icons = [
      { expression: /.png|.jpg|.jpeg|.svg|.ico/, icon: ImageIcon },
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
      { expression: /.yml|.yaml/, icon: YamlIcon },
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

    return selectedIcon || FileIcon
  }
  return { extractExtension, extractIcon }
}

export default useExtension
