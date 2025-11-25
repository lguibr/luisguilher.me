// File: src/reducers/FileReducer.tsx

// --- Helper ---
import { useTree } from 'src/hooks/useTree'

type RawTreeNode = {
  path: string
  mode?: string
  type?: string // 'blob' or 'tree'
  sha?: string
  size?: number
  url?: string
}

export type FileType = {
  name?: string
  content?: string
  newContent?: string
  path: string
  open?: boolean
  highLighted?: boolean
  current?: boolean
  image?: JSX.Element
  // undefined: not fetched/not applicable(file). []: fetched, possibly empty. FileType[]: fetched with children.
  children?: FileType[] | undefined
  index?: number
  diff?: boolean
  isDiff?: boolean
  type?:
    | 'blob'
    | 'tree'
    | 'resume'
    | 'repo-root'
    | 'placeholder-repo-root'
    | 'root-file'
    | 'root-dir'
  sha?: string
  // childrenFetched?: boolean; // Removed this flag
}

// --- Action Types ---

type SingleTargetAction = {
  type:
    | 'SET_CURRENT'
    | 'CLEAN_CURRENT'
    | 'SET_HIGHLIGHTED'
    | 'CLEAN_HIGHLIGHTED'
    | 'SET_IMAGE'
    | 'SET_CONTENT'
    | 'SET_NEW_CONTENT'
  payload: FileType
}

type SetFilesAction = { type: 'SET_FILES'; payload: FileType[] }

type AddRepoPlaceholdersAction = {
  type: 'ADD_REPO_PLACEHOLDERS'
  payload: { repoNames: string[] }
}

type MergeTreeAction = {
  type: 'MERGE_FETCHED_TREE'
  payload: {
    repoType: 'main' | 'other'
    repoName: string
    rawTree: RawTreeNode[]
  }
}

export type ActionType =
  | SingleTargetAction
  | SetFilesAction
  | AddRepoPlaceholdersAction
  | MergeTreeAction

const fileReducer = (state: FileType[], action: ActionType): FileType[] => {
  const { build, flatTree } = useTree()

  switch (action.type) {
    // --- Existing Actions ---
    case 'SET_CURRENT':
      return state.map(file => ({
        ...file,
        current: action?.payload?.path === file?.path,
        highLighted: action?.payload?.path === file?.path
      }))
    case 'CLEAN_CURRENT':
      return state.map(file => ({
        ...file,
        current: false,
        highLighted: false
      }))
    case 'SET_HIGHLIGHTED':
      return state.map(file => ({
        ...file,
        highLighted: action?.payload?.path === file?.path
      }))
    case 'CLEAN_HIGHLIGHTED':
      return state.map(file => ({ ...file, highLighted: false }))
    case 'SET_IMAGE':
      return state.map(file =>
        file?.path === action.payload.path
          ? {
              ...file,
              image: action.payload.image,
              content: undefined,
              newContent: undefined
            }
          : file
      )
    case 'SET_CONTENT': {
      const targetPath = action.payload.path.replace('__working__tree__', '')
      return state.map(file => {
        const filePath = file.path.replace('__working__tree__', '')
        if (filePath === targetPath) {
          return {
            ...file,
            content: action.payload.content,
            newContent: action.payload.content,
            diff: false,
            image: undefined,
            type: file.isDiff
              ? file.type
              : action.payload.type ?? file.type ?? 'blob'
          }
        }
        return file
      })
    }
    case 'SET_NEW_CONTENT': {
      const targetPath = action.payload.path.replace('__working__tree__', '')
      return state.map(file => {
        const filePath = file.path.replace('__working__tree__', '')
        if (filePath === targetPath) {
          const hasDiff = !!(file.content !== action.payload.newContent)
          return {
            ...file,
            diff: file.isDiff ? file.diff : hasDiff,
            newContent: action.payload.newContent
          }
        }
        return file
      })
    }
    case 'SET_FILES':
      return action.payload

    // --- New/Modified Actions ---
    case 'ADD_REPO_PLACEHOLDERS': {
      const { repoNames } = action.payload
      const newState = [...state]
      const repositoriesRootPath = 'repositories'
      let repoRoot = newState.find(f => f.path === repositoriesRootPath)
      if (!repoRoot) {
        repoRoot = {
          path: repositoriesRootPath,
          name: 'repositories',
          type: 'repo-root',
          children: []
        } // Start with empty array
        newState.push(repoRoot)
      }
      repoRoot.children = repoRoot.children ?? []
      repoNames.forEach(name => {
        const repoPath = `${repositoriesRootPath}/${name}`
        if (!newState.some(f => f.path === repoPath)) {
          newState.push({
            path: repoPath,
            name: name,
            type: 'placeholder-repo-root',
            children: undefined // Explicitly undefined for unfetched
            // childrenFetched: false // Removed
          })
        }
      })
      return newState
    }

    case 'MERGE_FETCHED_TREE': {
      const { repoType, repoName, rawTree } = action.payload
      const prefix = repoType === 'main' ? '' : `repositories/${repoName}/`
      const rootPath =
        repoType === 'main' ? repoName : `repositories/${repoName}`

      // 1. Prepare new nodes
      const treeWithCorrectPaths =
        rawTree?.map(node => ({
          ...node,
          path: prefix ? `${prefix}${node.path}` : node.path
        })) ?? []
      const newNodesHierarchical = build(treeWithCorrectPaths)
      const newNodesFlat = flatTree(newNodesHierarchical)

      // 2. Find or create the root node being updated
      const existingRootIndex = state.findIndex(f => f.path === rootPath)
      let stateWithoutOldData = state
      let updatedRootNode: FileType | undefined

      if (repoType === 'main') {
        // Remove all previous root-level files/dirs (excluding resume/repositories)
        stateWithoutOldData = state.filter(
          f =>
            f.path === 'resume' ||
            f.path.startsWith('resume/') ||
            f.path === 'repositories' ||
            f.path.startsWith('repositories/')
        )
        // No explicit root node needed for main repo
      } else {
        // 'other' repo type
        if (existingRootIndex !== -1) {
          const existingRoot = state[existingRootIndex]
          stateWithoutOldData = state.filter(
            file =>
              !file.path.startsWith(rootPath + '/') && file.path !== rootPath
          )
          // Create the updated root node, setting children to [] to signify fetch occurred
          updatedRootNode = {
            ...existingRoot,
            type: 'repo-root',
            children: [] /* childrenFetched: true */
          }
        } else {
          console.warn(
            `[Reducer] Placeholder root not found for ${rootPath}. Creating new.`
          )
          stateWithoutOldData = state.filter(
            file =>
              !file.path.startsWith(rootPath + '/') && file.path !== rootPath
          )
          updatedRootNode = {
            path: rootPath,
            name: repoName,
            type: 'repo-root',
            children: [] /* childrenFetched: true */
          }
        }
      }

      // 3. Create diff entries
      const newDiffNodes = newNodesFlat
        .filter(file => file.type === 'blob')
        .map(file => ({
          ...file,
          content: undefined,
          newContent: undefined,
          isDiff: true,
          path: file.path.concat('__working__tree__')
        }))

      // 4. Combine
      const mergedState = [
        ...stateWithoutOldData,
        ...(updatedRootNode ? [updatedRootNode] : []), // Add updated root only for 'other' repos
        ...newNodesFlat,
        ...newDiffNodes
      ]

      // 5. Ensure uniqueness
      const finalUniqueState = mergedState.filter(
        (file, index, self) =>
          index === self.findIndex(f => f.path === file.path)
      )

      return finalUniqueState
    }

    default:
      return state
  }
}

export default fileReducer
