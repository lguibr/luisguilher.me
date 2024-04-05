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
  isDiff?: boolean
}

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

    case 'SET_CONTENT':
      return state.map(file => ({
        ...file,
        content:
          file?.path.replace('__working__tree__', '') ===
          action.payload.path.replace('__working__tree__', '')
            ? action.payload.content
            : file?.content,
        newContent:
          file?.path.replace('__working__tree__', '') ===
          action.payload.path.replace('__working__tree__', '')
            ? action.payload.content
            : file?.newContent
      }))
    case 'SET_NEW_CONTENT': {
      return state.map(file => ({
        ...file,
        diff:
          file?.path.replace('__working__tree__', '') ===
          action.payload.path.replace('__working__tree__', '')
            ? !!(file.content !== action.payload.newContent)
            : file.diff,
        newContent:
          file?.path.replace('__working__tree__', '') ===
          action.payload.path.replace('__working__tree__', '')
            ? action.payload.newContent
            : file?.newContent
      }))
    }

    case 'SET_FILES':
      return action.payload

    default:
      return state
  }
}

export default fileReducer
