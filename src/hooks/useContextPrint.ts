import { useContext } from 'react'
import { PrintContextType, PrintContext } from 'src/contexts/PrintContext'

export const useContextPrint = (): PrintContextType => {
  const print = useContext(PrintContext)
  return print
}

export default useContextPrint
