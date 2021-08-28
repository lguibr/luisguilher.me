import { FileType } from 'src/contexts/FileContext'

type NodeTree = {
  path: string
  mode?: string
  type?: string
  sha?: string
  size?: number
  url?: string
}

export const useTree = (): {
  build: (
    files: NodeTree[],
    depth?: number,
    containDirectory?: string
  ) => FileType[]
  rebuildPaths: (
    files: NodeTree[],
    depth?: number,
    containDirectory?: string
  ) => FileType[]
  flatTree: (tree: FileType[]) => FileType[]
} => {
  const build = (
    files: NodeTree[],
    depth = 1,
    containDirectory = ''
  ): NodeTree[] => {
    const fileToCreate = files.filter(file => {
      const currentDepth = file.path.split('/').length
      const penultimatePath = file.path.split('/')[currentDepth - 2]

      return (
        currentDepth === depth &&
        (!containDirectory || containDirectory === penultimatePath)
      )
    })

    if (fileToCreate.length) {
      return fileToCreate.map((file: NodeTree) => {
        const splittedPath = file.path.split('/')
        const name = splittedPath[depth - 1].replace('__working__tree__', '')
        const newNode = {
          ...file,
          name,
          children:
            name === process.env.REPO || !name.includes('.')
              ? build(files, depth + 1, name)
              : []
        }
        return newNode
      })
    } else {
      return []
    }
  }

  const rebuildPaths = (array: FileType[]): FileType[] => {
    const splittedDiffFiles: FileType[] = array.map(_ => _)
    array.forEach(diffFile => {
      const createSubPaths = (path: string) => {
        const slicedPath = path.split('/')
        slicedPath.splice(-1)

        if (slicedPath) {
          const newPathToCreate = slicedPath.join('/')
          const pathToCreateAlreadyExist = !!splittedDiffFiles.find(
            diff => diff?.path === newPathToCreate
          )
          newPathToCreate &&
            !pathToCreateAlreadyExist &&
            splittedDiffFiles.push({ path: newPathToCreate })
          if (typeof slicedPath !== 'string' && slicedPath.length > 1) {
            createSubPaths(newPathToCreate)
          }
        }
      }

      createSubPaths(diffFile.path)
    })
    return splittedDiffFiles
  }

  const flatTree = (tree: FileType[]): FileType[] => {
    const rawFlattedTree: FileType[] = []
    const flatADepth = (tree: FileType[]) => {
      tree.forEach(node => {
        const { children } = node
        rawFlattedTree.push(node)
        if (children?.length) {
          flatADepth(children)
        }
      })
    }
    flatADepth(tree)

    const flattedTree: FileType[] = rawFlattedTree.map(
      ({ path, name, content, newContent }) => ({
        path,
        name,
        content,
        newContent
      })
    )

    return flattedTree
  }
  return { build, rebuildPaths, flatTree }
}

export default useTree
