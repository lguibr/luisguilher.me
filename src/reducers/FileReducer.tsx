export type FileType = {
  name?: string
  content?: string
  newContent?: string
  path: string
  open?: boolean
  highLighted?: boolean
  current?: boolean
  image?: JSX.Element
  children?: FileType[]
  index?: number
  diff?: boolean
  diffOpen?: boolean
  diffIndex?: boolean
}

type SingleTargetAction = {
  type:
    | 'SET_CURRENT'
    | 'CLEAN_CURRENT'
    | 'OPEN_FILE'
    | 'OPEN_FILE_DIFF'
    | 'CLEAN_OPEN'
    | 'SET_HIGHLIGHTED'
    | 'CLEAN_HIGHLIGHTED'
    | 'SET_IMAGE'
    | 'CLOSE_FILE'
    | 'SET_CONTENT'
    | 'SET_NEW_CONTENT'
    | 'CLOSE_FILES'

  payload: FileType
}

type MultipleTargetAction = { type: 'SET_FILES'; payload: FileType[] }

export type ActionType = SingleTargetAction | MultipleTargetAction

const fileReducer = (state: FileType[], action: ActionType): FileType[] => {
  switch (action.type) {
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
    case 'OPEN_FILE': {
      const indexes: number[] = state
        .filter(({ index }) => index)
        .map(({ index }) => index || 0)

      const max = indexes.length && Math.max(...indexes)

      return state.map(file => ({
        ...file,
        current: action?.payload?.path === file?.path,
        highLighted: action?.payload?.path === file?.path,
        open: action?.payload?.path === file?.path ? true : !!file?.open,
        index:
          action?.payload?.path === file?.path && !file?.open
            ? max + 1
            : file?.index
      }))
    }

    case 'CLEAN_OPEN':
      return state.map(file => ({
        ...file,
        open: false
      }))
    case 'SET_HIGHLIGHTED':
      return state.map(file => ({
        ...file,
        highLighted: action?.payload?.path === file?.path
      }))
    case 'CLEAN_HIGHLIGHTED':
      return state.map(file => ({
        ...file,
        highLighted: false
      }))
    case 'SET_IMAGE':
      return state.map(file => ({
        ...file,
        image:
          file?.path === action.payload.path
            ? action.payload.image
            : file?.image
      }))
    case 'CLOSE_FILE': {
      const { path } = action.payload
      const newFilesOpenFixed = state.map(newFile => ({
        ...newFile,
        open: newFile?.path === path ? false : newFile?.open,
        index: newFile?.path === path ? undefined : newFile?.index
      }))
      const newOpenedFiles = newFilesOpenFixed.filter(({ open }) => open)
      const maxCallback = (previousFile?: FileType, currentFile?: FileType) => {
        if (
          !previousFile ||
          !currentFile ||
          !previousFile?.index ||
          !currentFile?.index
        )
          return undefined
        return previousFile?.index > currentFile?.index
          ? previousFile
          : currentFile
      }

      const lastFileOpened = newOpenedFiles.reduce(
        maxCallback,
        newOpenedFiles[0]
      )
      return newFilesOpenFixed.map(newFile => ({
        ...newFile,
        current: lastFileOpened?.path === newFile.path,
        highLighted: lastFileOpened?.path === newFile.path
      }))
    }
    case 'SET_CONTENT':
      return state.map(file => ({
        ...file,
        content:
          file?.path === action.payload.path
            ? action.payload.content
            : file?.content,
        newContent:
          file?.path === action.payload.path
            ? action.payload.content
            : file?.newContent
      }))
    case 'SET_NEW_CONTENT': {
      return state.map(file => ({
        ...file,
        diff:
          file?.path === action.payload.path
            ? !!(file.newContent && file.content !== action.payload.newContent)
            : file.diff,
        newContent:
          file?.path === action.payload.path
            ? action.payload.newContent
            : file?.newContent
      }))
    }
    case 'CLOSE_FILES':
      return state.map(file => ({
        ...file,
        open: false,
        highLighted: false,
        current: false
      }))
    case 'SET_FILES':
      return action.payload
    default:
      return state
  }
}

export default fileReducer
