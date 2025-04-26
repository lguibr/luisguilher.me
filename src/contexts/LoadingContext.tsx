import { createContext, useState, useCallback } from 'react'
// Corrected import path
import { sketchs as availableSketches } from 'src/components/Core/AnimationOverlay/factoryMap'

type Loading = boolean
type SketchName = string | null

export type LoadingContextType = {
  loading: Loading
  currentSketch: SketchName
  setLoading: (loading: boolean) => void
}

export const LoadingContext = createContext({} as LoadingContextType)

export const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoadingState] = useState<Loading>(false)
  const [currentSketch, setCurrentSketch] = useState<SketchName>(null)

  const setLoading = useCallback((isLoading: boolean) => {
    setLoadingState(isLoading)
    if (isLoading) {
      const sketchNames = Object.keys(availableSketches)
      if (sketchNames.length > 0) {
        const randomIndex = Math.floor(Math.random() * sketchNames.length)
        const randomSketchName = sketchNames[randomIndex]
        console.log(
          `[LoadingContext] Setting random loading sketch: ${randomSketchName}`
        )
        setCurrentSketch(randomSketchName)
      } else {
        console.warn('[LoadingContext] No sketches available to choose from.')
        setCurrentSketch(null)
      }
    } else {
      console.log('[LoadingContext] Clearing loading sketch.')
      setCurrentSketch(null)
    }
  }, []) // Removed dependency on availableSketches as it's constant after import

  return (
    <LoadingContext.Provider
      value={{
        loading,
        currentSketch,
        setLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
