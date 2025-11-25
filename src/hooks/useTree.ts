// File: src/hooks/useTree.ts
import { FileType } from 'src/contexts/FileContext'

type RawTreeNode = {
  path: string
  mode?: string
  type?: string
  sha?: string
  size?: number
  url?: string
}

function isRawTreeNode(node: any): node is RawTreeNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof node.path === 'string' &&
    node.sha !== undefined &&
    node.content === undefined &&
    node.newContent === undefined
  )
}

function isFileType(node: any): node is FileType {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof node.path === 'string' &&
    !isRawTreeNode(node)
  )
}

export const useTree = (): {
  build: (nodes: (FileType | RawTreeNode)[]) => FileType[]
  rebuildPaths: (
    files: FileType[],
    depth?: number,
    containDirectory?: string
  ) => FileType[]
  flatTree: (tree: FileType[]) => FileType[]
} => {
  const build = (nodes: (FileType | RawTreeNode)[]): FileType[] => {
    const tree: FileType[] = []
    const map: { [key: string]: FileType & { childrenNodes?: FileType[] } } = {}

    nodes.forEach(node => {
      const path = node.path
      const cleanPath = path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '')
      if (!cleanPath || map[cleanPath]) return

      const name = cleanPath.split('/').pop() || cleanPath
      const typeFromFile = 'type' in node ? node.type : undefined
      const typeFromRaw = isRawTreeNode(node)
        ? (node.type as FileType['type'])
        : undefined
      const initialType = typeFromFile ?? typeFromRaw ?? 'blob'

      const existingContent = isFileType(node) ? node.content : undefined
      const existingNewContent = isFileType(node) ? node.newContent : undefined
      // Preserve children only if it's already a FileType and has a defined children array
      const existingChildren = isFileType(node) ? node.children : undefined

      map[cleanPath] = {
        ...(isFileType(node) ? node : {}), // Spread existing FileType first
        path: cleanPath,
        name: name,
        type: initialType as FileType['type'], // Will be refined later
        sha:
          ('sha' in node ? node.sha : undefined) ??
          (isRawTreeNode(node) ? node.sha : undefined),
        content: existingContent,
        newContent: existingNewContent,
        children: existingChildren, // Preserve existing children array/undefined status
        childrenNodes: [] // Temporary storage
        // childrenFetched removed
      }
    })

    Object.values(map).forEach(node => {
      const path = node.path
      const segments = path.split('/')
      if (segments.length === 1) {
        tree.push(node)
      } else {
        segments.pop()
        const parentPath = segments.join('/')
        const parentNode = map[parentPath]
        if (parentNode) {
          parentNode.childrenNodes = parentNode.childrenNodes ?? []
          parentNode.childrenNodes.push(node)
          if (
            parentNode.type !== 'repo-root' &&
            parentNode.type !== 'placeholder-repo-root' &&
            parentNode.type !== 'resume'
          ) {
            parentNode.type = 'tree'
          }
        } else {
          console.warn(`[buildTree] Parent node not found for path: ${path}`)
          tree.push(node)
        }
      }
    })

    Object.values(map).forEach(node => {
      if (node.childrenNodes && node.childrenNodes.length > 0) {
        node.childrenNodes.sort((a, b) => {
          const isDirA =
            a.type === 'tree' ||
            a.type === 'repo-root' ||
            a.type === 'placeholder-repo-root'
          const isDirB =
            b.type === 'tree' ||
            b.type === 'repo-root' ||
            b.type === 'placeholder-repo-root'
          if (isDirA && !isDirB) return -1
          if (!isDirA && isDirB) return 1
          return a.name?.localeCompare(b.name ?? '') ?? 0
        })
        node.children = node.childrenNodes // Assign sorted children
        // Ensure correct type
        if (
          node.type !== 'repo-root' &&
          node.type !== 'placeholder-repo-root' &&
          node.type !== 'resume'
        ) {
          node.type = 'tree'
        }
      } else {
        // If no children *added*, check if it *originally* had children undefined (placeholder)
        if (node.children === undefined) {
          // Keep type as placeholder if children are still undefined
          node.type =
            node.type === 'placeholder-repo-root'
              ? 'placeholder-repo-root'
              : 'blob'
        } else {
          // If children is [], it's an empty fetched folder or file
          if (node.type !== 'repo-root' && node.type !== 'resume') {
            node.type = 'blob' // Assume blob if empty children array unless repo/resume root
          }
        }
        // Keep children undefined or empty array based on original/fetched status
        node.children = Array.isArray(node.children) ? [] : undefined
      }
      delete node.childrenNodes // Remove temporary property
    })

    // Sort root nodes
    tree.sort((a, b) => {
      const order = ['resume', 'repositories']
      const indexA = order.indexOf(a.path)
      const indexB = order.indexOf(b.path)
      if (indexA !== -1 && indexB === -1) return -1
      if (indexA === -1 && indexB !== -1) return 1
      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      const isDirA =
        a.type === 'tree' ||
        a.type === 'repo-root' ||
        a.type === 'placeholder-repo-root'
      const isDirB =
        b.type === 'tree' ||
        b.type === 'repo-root' ||
        b.type === 'placeholder-repo-root'
      if (isDirA && !isDirB) return -1
      if (!isDirA && isDirB) return 1
      return a.path.localeCompare(b.path)
    })

    return tree
  }

  const rebuildPaths = (array: FileType[]): FileType[] => {
    const splittedDiffFiles: FileType[] = array.map(f => ({ ...f }))
    array.forEach(diffFile => {
      const createSubPaths = (path: string) => {
        const slicedPath = path.split('/')
        if (slicedPath.length <= 1) return
        slicedPath.pop()
        const parentPath = slicedPath.join('/')
        if (!parentPath) return
        const parentExists = splittedDiffFiles.some(
          diff => diff?.path === parentPath
        )
        if (!parentExists) {
          const parentName = slicedPath[slicedPath.length - 1]
          // Mark parent as tree with empty children array initially
          splittedDiffFiles.push({
            path: parentPath,
            name: parentName,
            type: 'tree',
            children: []
          })
          createSubPaths(parentPath)
        } else {
          const existingParent = splittedDiffFiles.find(
            diff => diff?.path === parentPath
          )
          // Ensure existing parent is marked as tree and has children array
          if (existingParent) {
            existingParent.type = 'tree'
            existingParent.children = existingParent.children ?? []
          }
        }
      }
      createSubPaths(diffFile.path)
    })
    return splittedDiffFiles
  }

  const flatTree = (tree: FileType[]): FileType[] => {
    const rawFlattedTree: FileType[] = []
    const flatADepth = (nodes: FileType[]) => {
      nodes.forEach(node => {
        const { children, ...rest } = node
        // Preserve children undefined/[] status
        rawFlattedTree.push({ ...rest, children: children })
        if (Array.isArray(children) && children.length > 0) {
          flatADepth(children)
        }
      })
    }
    flatADepth(tree)
    const flattedTree: FileType[] = rawFlattedTree.map(
      // Pass children through directly
      ({
        path,
        name,
        content,
        newContent,
        image,
        diff,
        isDiff,
        children,
        type,
        sha
      }) => ({
        path,
        name,
        content,
        newContent,
        image,
        diff,
        isDiff,
        children,
        type,
        sha
      })
    )
    return flattedTree.filter(
      (file, index, self) => index === self.findIndex(f => f.path === file.path)
    )
  }

  return { build, rebuildPaths, flatTree }
}

export default useTree
