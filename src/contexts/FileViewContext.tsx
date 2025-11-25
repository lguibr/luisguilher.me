import { createContext, useEffect, useState } from 'react'

export type Orientation = 'top' | 'bottom' | 'right' | 'left'

export type FileViewsContextType = {
  openedFiles: string[]
  currentFile: string | undefined
  orientation: Orientation
  fileViewsTree: FileViewsContextType
  id: number
  children: FileViewsContextType[]
  openFile: (fileId: string, nodeId: number) => void
  closeFile: (fileId: string, nodeId: number) => void
  setCurrentFile: (fileId: string, nodeId: number) => void
  findNodeById: (
    id: number,
    node: FileViewsContextType
  ) => FileViewsContextType | null
  createChild: (
    fileId: string,
    orientation: Orientation,
    parentId: number
  ) => void
  removeNode: (nodeId: number) => void
  getRootId: () => number
  setOrientation: (orientation: Orientation, nodeId: number) => void
}

export const FileViewsContext = createContext<FileViewsContextType>(
  {} as FileViewsContextType
)

const noop = () => {
  // no op;
}

export const FileViewsProvider: React.FC<{
  initialOpenedFile?: string | string[]
}> = ({ children, initialOpenedFile }) => {
  const isGuiding =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage?.getItem('GUIDE_TOUR') ?? 'false')

  const initialFiles = Array.isArray(initialOpenedFile)
    ? initialOpenedFile
    : initialOpenedFile
    ? [initialOpenedFile]
    : []

  const [fileViewsTree, setFileViewsTree] = useState<FileViewsContextType>({
    openedFiles: !isGuiding ? initialFiles : [],
    currentFile: !isGuiding ? initialFiles[0] : undefined,
    orientation: 'bottom',
    id: 0,
    children: [],
    openFile: noop,
    closeFile: noop,
    setCurrentFile: noop,
    findNodeById: () => null,
    getRootId: () => 0,
    createChild: noop,
    removeNode: noop,
    setOrientation: noop,
    fileViewsTree: {} as FileViewsContextType
  })

  const getRootId = () => fileViewsTree.id

  const setOrientation = (orientation: Orientation, nodeId: number) => {
    setFileViewsTree(prevTree => {
      const nodeToUpdate = findNodeById(nodeId, prevTree)
      if (nodeToUpdate) {
        nodeToUpdate.orientation = orientation
      }
      return { ...prevTree }
    })
  }

  const setCurrentFile = (fileId: string, nodeId: number) => {
    setFileViewsTree(prevTree => {
      const nodeToUpdate = findNodeById(nodeId, prevTree)
      if (nodeToUpdate) {
        nodeToUpdate.currentFile = fileId
        nodeToUpdate.openedFiles = [
          ...new Set([...nodeToUpdate.openedFiles, fileId])
        ]
      }
      return { ...prevTree }
    })
  }

  const openFile = (fileId: string, nodeId: number) => {
    setFileViewsTree(prevTree => {
      const nodeToUpdate = findNodeById(nodeId, prevTree)
      if (nodeToUpdate) {
        if (!nodeToUpdate.openedFiles.includes(fileId)) {
          nodeToUpdate.openedFiles.push(fileId)
        }
        nodeToUpdate.currentFile = fileId
      }
      return { ...prevTree }
    })
  }

  const closeFile = (fileId: string, nodeId: number) => {
    setFileViewsTree(prevTree => {
      const nodeToUpdate = findNodeById(nodeId, prevTree)
      if (nodeToUpdate) {
        const newOpenedFiles = nodeToUpdate.openedFiles.filter(
          id => id !== fileId
        )
        nodeToUpdate.openedFiles = newOpenedFiles
        if (nodeToUpdate.currentFile === fileId) {
          nodeToUpdate.currentFile =
            nodeToUpdate.openedFiles[nodeToUpdate.openedFiles.length - 1] ||
            undefined
        }
      }
      return { ...prevTree }
    })
  }

  const findNodeById = (
    id: number,
    node: FileViewsContextType
  ): FileViewsContextType | null => {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNodeById(id, child)
      if (found) return found
    }
    return null
  }

  const getParentNode = (
    nodeId: number,
    node: FileViewsContextType,
    parent: FileViewsContextType | null = null
  ): FileViewsContextType | null => {
    if (node.id === nodeId) {
      return parent
    }
    for (const child of node.children) {
      const result = getParentNode(nodeId, child, node)
      if (result) {
        return result
      }
    }
    return null
  }

  const removeNode = (nodeId: number) => {
    const targetNode = findNodeById(nodeId, fileViewsTree)
    const parentNode = getParentNode(nodeId, fileViewsTree)
    const currentChildrenToRecover = targetNode?.children ?? []

    setFileViewsTree(prevTree => {
      if (prevTree.id === nodeId) return prevTree
      if (parentNode) {
        parentNode.children = parentNode.children.filter(
          child => child.id !== nodeId
        )
        parentNode.children.push(...currentChildrenToRecover)
      }
      return { ...prevTree }
    })
  }

  const addNewNode = (
    node: FileViewsContextType,
    newChild: FileViewsContextType
  ) => {
    if (node.children.length === 0) {
      node.children.push(newChild)
    } else {
      // Creating an intermediary node
      const intermediaryNode: FileViewsContextType = {
        ...node.children[0],
        id: node.children[node.children.length - 1].id + 1,
        children: [newChild]
      }
      node.children = [intermediaryNode]
    }
  }

  const flattenTree = (node: FileViewsContextType): FileViewsContextType[] => {
    const flatList: FileViewsContextType[] = []

    const traverse = (node: FileViewsContextType) => {
      flatList.push({ ...node, children: [] })
      node.children.forEach(child => traverse(child))
    }

    traverse(node)
    return flatList
  }

  const rebuildTree = (nodes: FileViewsContextType[]): FileViewsContextType => {
    if (nodes.length === 0) {
      return {
        openedFiles: [],
        currentFile: undefined,
        orientation: 'bottom',
        id: 0,
        children: [],
        openFile: noop,
        closeFile: noop,
        setCurrentFile: noop,
        findNodeById: () => null,
        getRootId: () => 0,
        createChild: noop,
        removeNode: noop,
        setOrientation: noop,
        fileViewsTree: {} as FileViewsContextType
      }
    }

    const root = {
      ...nodes,
      ...nodes[0],
      id: 0,
      children: [] as FileViewsContextType[]
    }

    let currentNode = root

    for (let i = 1; i < nodes.length; i++) {
      const newNode = {
        ...nodes,
        ...nodes[i],
        children: []
      }

      currentNode.children = [newNode]
      currentNode = newNode
    }

    return root
  }

  const rebalanceTree = (node: FileViewsContextType): FileViewsContextType => {
    // Flatten the tree
    let nodes = flattenTree(node)
    // Filter out nodes without openedFiles
    nodes = nodes.filter(n => n.openedFiles.length > 0)
    return rebuildTree(nodes)
  }

  useEffect(() => {
    const newRebalancedTree = rebalanceTree(fileViewsTree)

    const haveTreeViewsChanged =
      flattenTree(newRebalancedTree).length !==
      flattenTree(fileViewsTree).length

    haveTreeViewsChanged && setFileViewsTree(newRebalancedTree)
  }, [fileViewsTree])

  const createChild = (
    fileId: string,
    orientation: Orientation,
    parentId = 0
  ) => {
    setFileViewsTree(prevTree => {
      const newChild: FileViewsContextType = {
        openedFiles: [fileId],
        currentFile: fileId,
        orientation: orientation,
        id: Date.now(),
        children: [],
        fileViewsTree,
        setCurrentFile,
        openFile,
        closeFile,
        createChild,
        findNodeById,
        removeNode,
        getRootId,
        setOrientation
      }

      const nodeToUpdate = findNodeById(parentId, prevTree)
      if (nodeToUpdate) addNewNode(nodeToUpdate, newChild)

      return { ...prevTree }
    })
  }

  return (
    <FileViewsContext.Provider
      value={{
        ...fileViewsTree,
        setCurrentFile,
        openFile,
        closeFile,
        createChild,
        findNodeById,
        fileViewsTree,
        removeNode,
        setOrientation,
        getRootId
      }}
    >
      {children}
    </FileViewsContext.Provider>
  )
}
