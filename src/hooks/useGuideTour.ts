import { useContext } from 'react'
import {
  GuideTourContextType,
  GuideTourContext
} from 'src/contexts/GuideTourContext'

export const useContextGuideTour = (): GuideTourContextType => {
  const guideTour = useContext(GuideTourContext)
  return guideTour
}

export default useContextGuideTour
