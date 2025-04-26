import { createContext, useState, useCallback } from 'react'
import { sketchFactoryMap } from 'src/components/Core/AnimationOverlay/factoryMap'

type Loading = boolean
type SketchName = string | null

export type LoadingContextType = {
  loading: Loading
  currentSketch: SketchName
  setLoading: (loading: boolean) => void
  showOverlay: (sketchName: SketchName) => void
  hideOverlay: () => void
}

export const LoadingContext = createContext({} as LoadingContextType)

export const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoadingState] = useState<Loading>(false)
  const [currentSketch, setCurrentSketch] = useState<SketchName>(null)

  const hideOverlay = useCallback(() => {
    console.log('[LoadingContext] Hiding overlay.')
    setCurrentSketch(null)
    // Optionally sync loading state if hideOverlay implies loading finished
    // setLoadingState(false);
  }, [])

  const showOverlay = useCallback(
    (sketchName: SketchName) => {
      if (sketchName && sketchFactoryMap[sketchName]) {
        // Check if sketch exists
        console.log(
          `[LoadingContext] Showing overlay with sketch: ${sketchName}`
        )
        setCurrentSketch(sketchName)
      } else if (sketchName) {
        console.warn(
          `[LoadingContext] Sketch "${sketchName}" not found in factoryMap. Hiding overlay.`
        )
        hideOverlay()
      } else {
        console.log(
          '[LoadingContext] showOverlay called with null. Hiding overlay.'
        )
        hideOverlay()
      }
    },
    [hideOverlay]
  )

  // setLoading controls the overlay state during general loading periods
  const setLoading = useCallback((isLoading: boolean) => {
    setLoadingState(isLoading) // Update the general loading state first
    if (isLoading) {
      const sketchNames = Object.keys(sketchFactoryMap)
      if (sketchNames.length > 0) {
        const randomIndex = Math.floor(Math.random() * sketchNames.length)
        const randomSketchName = sketchNames[randomIndex]
        console.log(
          `[LoadingContext] setLoading(true) triggered. Showing random sketch: ${randomSketchName}`
        )
        // Set sketch directly, showOverlay isn't needed here as it's tied to loading state
        setCurrentSketch(randomSketchName)
      } else {
        console.warn(
          '[LoadingContext] setLoading(true) triggered, but no sketches available.'
        )
        setCurrentSketch(null) // Ensure overlay is hidden if no sketches
      }
    } else {
      console.log(
        '[LoadingContext] setLoading(false) triggered. Hiding overlay.'
      )
      // Hide overlay when loading stops
      setCurrentSketch(null)
    }
  }, []) // Removed showOverlay/hideOverlay dependencies as they are not called directly

  return (
    <LoadingContext.Provider
      value={{
        loading,
        currentSketch,
        setLoading,
        showOverlay,
        hideOverlay
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
