import { createContext, useState, useCallback, useRef, ReactNode } from 'react'
import { sketchs as sketchRegistry } from 'src/components/Core/Sketchs' // Assuming sketchs array includes name

interface AnimationOptions {
  duration?: number // in milliseconds
  // Add other options like targetElementId if needed later
}

interface AnimationState {
  isVisible: boolean
  sketchName: string | null
  options: AnimationOptions
}

export type AnimationContextType = {
  playAnimation: (sketchName: string, options?: AnimationOptions) => void
  stopAnimation: () => void
  animationState: AnimationState
}

export const AnimationContext = createContext<AnimationContextType>(
  {} as AnimationContextType
)

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isVisible: false,
    sketchName: null,
    options: {}
  })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const stopAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setAnimationState({ isVisible: false, sketchName: null, options: {} })
  }, [])

  const playAnimation = useCallback(
    (sketchName: string, options: AnimationOptions = {}) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      let actualSketchName = sketchName
      if (sketchName === 'random') {
        const randomIndex = Math.floor(Math.random() * sketchRegistry.length)
        actualSketchName = sketchRegistry[randomIndex]?.name || null
      } else {
        // Validate if sketchName exists in registry
        const exists = sketchRegistry.some(s => s.name === sketchName)
        if (!exists) {
          console.warn(`Sketch "${sketchName}" not found in registry.`)
          actualSketchName = null
        }
      }

      if (!actualSketchName) {
        stopAnimation() // Ensure state is clean if sketch is invalid/random fails
        return
      }

      setAnimationState({
        isVisible: true,
        sketchName: actualSketchName,
        options
      })

      // Set timeout to stop animation if duration is provided
      if (options.duration && options.duration > 0) {
        timeoutRef.current = setTimeout(() => {
          stopAnimation()
        }, options.duration)
      }
    },
    [stopAnimation]
  )

  return (
    <AnimationContext.Provider
      value={{
        playAnimation,
        stopAnimation,
        animationState
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}