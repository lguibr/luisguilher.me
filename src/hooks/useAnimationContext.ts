import { useContext } from 'react'
import {
  AnimationContext,
  AnimationContextType
} from 'src/contexts/AnimationContext'

export const useAnimationContext = (): AnimationContextType => {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error(
      'useAnimationContext must be used within an AnimationProvider'
    )
  }
  return context
}

export default useAnimationContext