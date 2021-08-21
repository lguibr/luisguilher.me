import { useContext } from 'react'
import { FileContext, FileContextType } from 'src/contexts/FileContext'

export const useContextFile = (): FileContextType => {
  const file = useContext(FileContext)
  return file
}

export default useContextFile
