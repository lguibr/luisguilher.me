// eslint-disable-next-line  @typescript-eslint/no-explicit-any

import { useState, useEffect } from 'react'

export const useTree = () => {
  type NodeTree = {
    path: string
    mode?: string
    type?: string
    sha?: string
    size?: number
    url?: string
  }

  const currentSha = process.env.shaBranch || 'main'
  const threePath = `https://api.github.com/repos/lguibr/luisguilher.me/git/trees/${currentSha}?recursive=1`
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
    const res = await fetch(threePath)
    const data = await res.json()
    const rawTree = data.tree

    const tree: NodeTree[] = build(rawTree)

    setTree(tree)
  }

  useEffect(() => {
    fetchTree()
  }, [])
  return { tree: tree }
}

export default useTree
