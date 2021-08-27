export type FileType = {
  name?: string
  content?: string
  newContent?: string
  path: string
  open?: boolean
  highLighted?: boolean
  current?: boolean
  image?: JSX.Element
  children?: File[]
  index?: number
}

type action = {
  type:
    | 'SET_CURRENT'
    | 'OPEN_FILE'
    | 'SET_HIGHLIGHTED'
    | 'SET_IMAGE'
    | 'CLOSE_FILE'
    | 'SET_CONTENT'
    | 'SET_NEW_CONTENT'
    | 'CLOSE_FILES'

  payload: FileType
}

const fileReducer = (
  state: FileType[],
  { type, payload }: action
): FileType[] => {
  switch (type) {
    case 'SET_CURRENT':
      return state.map(file => ({
        ...file,
        current: payload?.path === file?.path,
        highLighted: payload?.path === file?.path
      }))
    case 'OPEN_FILE': {
      const indexes: number[] = state
        .filter(({ index }) => index)
        .map(({ index }) => index || 0)

      const max = indexes.length && Math.max(...indexes)

      return state.map(file => ({
        ...file,
        current: payload?.path === file?.path,
        highLighted: payload?.path === file?.path,
        open: payload?.path === file?.path ? true : !!file?.open,
        index:
          payload?.path === file?.path && !file?.open ? max + 1 : file?.index
      }))
    }
    case 'SET_HIGHLIGHTED':
      return state.map(file => ({
        ...file,
        highLighted: payload?.path === file?.path
      }))
    case 'SET_IMAGE': // NOTE CAREFUL TO PLUGIN IMAGE ON PAYLOAD FILE !!
      return state.map(file => ({
        ...file,
        image: file?.path === payload.path ? payload.image : file?.image
      }))
    case 'CLOSE_FILE': {
      const { path } = payload
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
    case 'SET_CONTENT': // NOTE CAREFUL TO PLUGIN CONTENT ON PAYLOAD FILE !!
      return state.map(file => ({
        ...file,
        content: file?.path === payload.path ? payload.content : file?.content,
        newContent:
          file?.path === payload.path ? payload.content : file?.newContent
      }))
    case 'SET_NEW_CONTENT': // NOTE CAREFUL TO PLUGIN NEW CONTENT ON PAYLOAD FILE !!
      return state.map(file => ({
        ...file,
        newContent:
          file?.path === payload.path ? payload.content : file?.newContent
      }))
    case 'CLOSE_FILES':
      return state.map(file => ({
        ...file,
        open: false,
        highLighted: false,
        current: false
      }))
  }
}

export default fileReducer
