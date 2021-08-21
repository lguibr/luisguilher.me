import { useContext } from 'react'
import { LoadingContextType, LoadingContext } from 'src/contexts/LoadingContext'

export const useContextLoading = (): LoadingContextType => {
  const loading = useContext(LoadingContext)
  return loading
}

export default useContextLoading
