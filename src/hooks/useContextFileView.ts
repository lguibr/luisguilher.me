import { useContext } from 'react'
import {
  FileViewsContext,
  FileViewsContextType
} from 'src/contexts/FileViewContext'

export const useFileViewsContext = (): FileViewsContextType => {
  const fileViewsContext = useContext(FileViewsContext)
  return fileViewsContext
}

export default useFileViewsContext
