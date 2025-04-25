import { createContext, useState, useCallback } from 'react'
import { useAnimationContext } from 'src/hooks/useAnimationContext' // Import hook

type Loading = boolean

export type LoadingContextType = {
  loading: Loading
  flashLoading: (time?: number, sketchName?: string) => void // Accept optional sketchName
  setLoading: (loading: boolean) => void
}

export const LoadingContext = createContext({} as LoadingContextType)

export const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoadingState] = useState<Loading>(false)
  // We need AnimationContext here to trigger timed animations for flashLoading
  const { playAnimation, stopAnimation, animationState } = useAnimationContext()

  const setLoading = useCallback(
    (isLoading: boolean) => {
      setLoadingState(isLoading)
      // Logic to start/stop continuous loading animation is now in Loading component
    },
    [] // No dependencies needed for basic state setting
  )

  const flashLoading = useCallback(
    (time = 3500, sketchName = 'random') => {
      // Use AnimationContext to play a *timed* animation
      if (!animationState.isVisible) { // Only flash if no other animation is playing
        playAnimation(sketchName, { duration: time })
      }
      // We don't necessarily set the main 'loading' state to true here,
      // as flashLoading might be independent of actual data loading.
      // If it should also show the continuous loader, call setLoading(true) here
      // and handle the stop in setLoading(false) or the Loading component.
    },
    [playAnimation, animationState.isVisible]
  )

  return (
    <LoadingContext.Provider
      value={{
        loading,
        flashLoading,
        setLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}