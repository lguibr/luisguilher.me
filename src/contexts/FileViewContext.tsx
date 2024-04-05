import { createContext, useEffect, useState } from 'react'

export type Orientation = 'top' | 'bottom' | 'right' | 'left'

export type FileViewsContextType = {
  openedFiles: string[]
  currentFile: string | undefined
  orientation: Orientation
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

export const FileViewsProvider: React.FC<{ initialOpenedFile?: string }> = ({
  children,
  initialOpenedFile
}) => {
  const [fileViewsTree, setFileViewsTree] = useState<FileViewsContextType>({
    openedFiles: initialOpenedFile ? [initialOpenedFile] : [],
    currentFile: initialOpenedFile,
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
    setOrientation: noop
  })

  const getRootId = () => {
    return fileViewsTree.id
  }

  const setOrientation = (orientation: Orientation, nodeId: number) => {
    setFileViewsTree(prevTree => {
      const nodeToUpdate = findNodeById(nodeId, prevTree)
      if (nodeToUpdate) {
        nodeToUpdate.orientation = orientation
      }
      return { ...prevTree }
    })
  }

  console.log(fileViewsTree)
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
        !nodeToUpdate.openedFiles.includes(fileId) &&
          nodeToUpdate.openedFiles.push(fileId)
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
    const currentChildrensToRecover = targetNode?.children ?? []

    setFileViewsTree(prevTree => {
      if (prevTree.id === nodeId) return prevTree
      if (parentNode) {
        parentNode.children = currentChildrensToRecover
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

  useEffect(() => {
    const removeEmptyNodes = (node: FileViewsContextType) => {
      node.children = node.children.filter(child => {
        if (child.openedFiles.length === 0) {
          removeNode(child.id)
          return false
        }
        removeEmptyNodes(child)
        return true
      })
    }

    removeEmptyNodes(fileViewsTree)
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
        removeNode,
        setOrientation
      }}
    >
      {children}
    </FileViewsContext.Provider>
  )
}
