import { useState, useEffect } from 'react'
import githubService from 'services/github'
type NodeTree = {
  path: string
  mode?: string
  type?: string
  sha?: string
  size?: number
  url?: string
}
export const useTree = (): { tree: NodeTree[] } => {
  const { fetchRepoTree } = githubService
  const [tree, setTree] = useState<NodeTree[]>([])

  const build = (
    files: NodeTree[],
    depth = 1,
    containDirectory = ''
  ): NodeTree[] => {
    const fileToCreate = files.filter(
      file =>
        file.path.split('/').length === depth &&
        file.path.includes(containDirectory)
    )

    if (fileToCreate.length) {
      return fileToCreate.map((file: NodeTree) => {
        const splittedPath = file.path.split('/')
        const name = splittedPath[depth - 1]
        const newNode = {
          ...file,
          name,
          children: !name.includes('.') ? build(files, depth + 1, name) : []
        }
        return newNode
      })
    } else {
      return []
    }
  }

  const fetchTree = async () => {
    const rawTree = await fetchRepoTree()
    const tree: NodeTree[] = build(rawTree)
    setTree(tree)
  }

  useEffect(() => {
    fetchTree()
  }, [])
  return { tree: tree }
}

export default useTree
