// File: src/utils/treeUtils.ts
import { FileType } from 'src/contexts/FileContext'

export type RawTreeNode = {
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

export const buildTree = (nodes: (FileType | RawTreeNode)[]): FileType[] => {
  console.log(`[buildTree] Building hierarchy for ${nodes.length} nodes.`)
  const tree: FileType[] = []
  const map: { [key: string]: FileType & { childrenNodes?: FileType[] } } = {}

  // First pass: add all provided nodes to the map
  nodes.forEach(node => {
    const path = node.path
    const cleanPath = path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '')
    if (!cleanPath || map[cleanPath]) return

    const name = cleanPath.split('/').pop() || cleanPath
    const typeFromFile = 'type' in node ? node.type : undefined
    const typeFromRaw = isRawTreeNode(node)
      ? node.type === 'tree'
        ? 'tree'
        : 'blob'
      : undefined
    const initialType = typeFromFile ?? typeFromRaw ?? 'blob'

    const existingContent = isFileType(node) ? node.content : undefined
    const existingNewContent = isFileType(node) ? node.newContent : undefined
    const existingChildren = isFileType(node) ? node.children : undefined

    map[cleanPath] = {
      ...(isFileType(node) ? node : {}),
      path: cleanPath,
      name: name,
      type: initialType as FileType['type'],
      sha:
        ('sha' in node ? node.sha : undefined) ??
        (isRawTreeNode(node) ? node.sha : undefined),
      content: existingContent,
      newContent: existingNewContent,
      children: existingChildren,
      childrenNodes: []
    }
  })

  // Second pass: ensure all parent nodes exist
  nodes.forEach(node => {
    const segments = node.path.split('/')
    let currentPath = ''
    for (let i = 0; i < segments.length - 1; i++) {
      currentPath = currentPath ? `${currentPath}/${segments[i]}` : segments[i]
      if (!map[currentPath]) {
        map[currentPath] = {
          path: currentPath,
          name: segments[i],
          type: 'tree',
          children: [],
          childrenNodes: []
        }
      }
    }
  })

  // Third pass: build hierarchy
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
        // Avoid duplicates if a parent node was already added manually or via segments
        if (!parentNode.childrenNodes.some(c => c.path === node.path)) {
          parentNode.childrenNodes.push(node)
        }
        if (
          parentNode.type !== 'repo-root' &&
          parentNode.type !== 'placeholder-repo-root' &&
          parentNode.type !== 'resume'
        ) {
          parentNode.type = 'tree'
        }
      } else {
        // This should not happen now with the second pass
        tree.push(node)
      }
    }
  })

  // Final pass: sort and clean up
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
      if (node.childrenNodes.length > 0) {
        node.children = node.childrenNodes
      }

      if (
        node.type !== 'repo-root' &&
        node.type !== 'placeholder-repo-root' &&
        node.type !== 'resume' &&
        node.childrenNodes.length > 0
      ) {
        node.type = 'tree'
      }
    } else {
      // If no child nodes were found in the flat list:
      // Preserve 'undefined' for placeholders so UI knows to fetch them.
      // For others, if they were supposed to have children but are empty, set to []
      if (node.type === 'placeholder-repo-root' || node.type === 'repo-root') {
        // Keep node.children as it was (likely undefined or already [] if fetched)
      } else {
        node.children = Array.isArray(node.children) ? [] : undefined
      }
    }

    delete node.childrenNodes
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

export const rebuildPaths = (array: FileType[]): FileType[] => {
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

export const flatTree = (tree: FileType[]): FileType[] => {
  const result: FileType[] = []
  const flatten = (nodes: FileType[]) => {
    nodes.forEach(node => {
      const { children, ...rest } = node
      result.push({ ...rest, children })
      if (Array.isArray(children) && children.length > 0) {
        flatten(children)
      }
    })
  }
  flatten(tree)
  return result.filter(
    (file, index, self) => index === self.findIndex(f => f.path === file.path)
  )
}
