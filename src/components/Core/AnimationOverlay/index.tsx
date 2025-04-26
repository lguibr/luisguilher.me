import { useEffect, useRef, useState, useCallback } from 'react' // Ensure React is imported first
import { useTheme } from 'styled-components'
import { Overlay, CanvasContainer, StatusMessage } from './styled'
// Removed direct SketchFactory type import if not needed elsewhere
import theme from 'src/styles/theme'
import type P5 from 'p5'
import { sketchFactoryMap } from './factoryMap' // Import the map from the new file

type Theme = typeof theme['vs-dark']

interface AnimationOverlayProps {
  sketchName: string | null
  onClose: () => void
}

const AnimationOverlay: React.FC<AnimationOverlayProps> = ({
  sketchName,
  onClose
}) => {
  const currentTheme = useTheme()
  const p5InstanceRef = useRef<P5 | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Removed unused resizeObserverRef
  const resizeTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
  const currentResizeListener = useRef<(() => void) | null>(null) // Ref to store the listener

  const cleanupP5 = useCallback(() => {
    console.log(
      `[AnimationOverlay Cleanup] Cleaning up P5 for ${sketchName}...`
    )
    if (resizeTimeoutIdRef.current) {
      clearTimeout(resizeTimeoutIdRef.current)
      resizeTimeoutIdRef.current = null
    }
    // Remove window resize listener on cleanup
    if (currentResizeListener.current) {
      window.removeEventListener('resize', currentResizeListener.current)
      currentResizeListener.current = null // Clear the stored listener
      console.log('[AnimationOverlay Cleanup] Resize listener removed.')
    }

    if (p5InstanceRef.current) {
      try {
        p5InstanceRef.current.remove()
        console.log(`[AnimationOverlay Cleanup] P5 instance removed.`)
      } catch (removeError) {
        console.error(
          '[AnimationOverlay Cleanup] Error during p5 remove():',
          removeError
        )
      }
      p5InstanceRef.current = null
    }
    setError(null)
  }, [sketchName]) // Keep sketchName dependency for logging

  useEffect(() => {
    console.log(
      `[AnimationOverlay useEffect] Running for sketchName prop: ${sketchName}`
    )

    // If sketchName becomes null, ensure cleanup happens
    if (!sketchName) {
      if (p5InstanceRef.current) {
        console.log(
          '[AnimationOverlay useEffect] sketchName is null, cleaning up existing instance.'
        )
        cleanupP5()
      }
      return // Abort if no sketch name
    }

    if (!containerRef.current) {
      console.log(
        '[AnimationOverlay useEffect] Aborting: Canvas container not ready.'
      )
      setError('Canvas container not ready.')
      return
    }

    const factory = sketchFactoryMap[sketchName]
    if (!factory) {
      console.error(
        `[AnimationOverlay useEffect] Aborting: Sketch factory for "${sketchName}" not found.`
      )
      setError(`Sketch factory for "${sketchName}" not found.`)
      return
    }

    // If an instance exists for a *different* sketch, clean it up first
    if (p5InstanceRef.current && p5InstanceRef.current.canvas?.parentElement) {
      console.log(
        `[AnimationOverlay useEffect] Cleaning up previous sketch before initializing ${sketchName}.`
      )
      cleanupP5()
    }

    let isMounted = true // Track mount status within the effect scope
    setError(null)

    const initialize = async () => {
      // Only initialize if no instance currently exists
      if (p5InstanceRef.current) {
        console.log(
          '[AnimationOverlay initialize] Instance already exists, skipping initialization.'
        )
        return
      }

      let P5Constructor: typeof P5 | null = null
      try {
        console.log('[AnimationOverlay initialize] Dynamically importing P5...')
        P5Constructor = (await import('p5')).default
        if (!isMounted || !containerRef.current) {
          console.log(
            '[AnimationOverlay initialize] Aborting after P5 import: Unmounted or container gone.'
          )
          return
        }
        console.log('[AnimationOverlay initialize] P5 imported successfully.')

        console.log(
          `[AnimationOverlay initialize] Creating P5 instance for: ${sketchName}...`
        )
        const sketchFunction = factory(currentTheme as Theme)
        // Ensure containerRef.current is not null before passing
        if (!containerRef.current) {
          console.error(
            '[AnimationOverlay initialize] Container ref became null before P5 constructor.'
          )
          return
        }
        const instance = new P5Constructor(sketchFunction, containerRef.current)
        p5InstanceRef.current = instance
        console.log(
          `[AnimationOverlay initialize] P5 instance CREATED successfully for: ${sketchName}`
        )

        const resizeCanvas = () => {
          if (p5InstanceRef.current && containerRef.current) {
            const clientWidth = window.innerWidth
            const clientHeight = window.innerHeight
            if (clientWidth > 0 && clientHeight > 0) {
              try {
                p5InstanceRef.current.resizeCanvas(clientWidth, clientHeight)
                if (typeof p5InstanceRef.current.windowResized === 'function') {
                  p5InstanceRef.current.windowResized()
                }
              } catch (resizeError) {
                console.error(
                  '[AnimationOverlay resizeCanvas] Error during canvas resize:',
                  resizeError
                )
              }
            }
          }
        }
        currentResizeListener.current = resizeCanvas // Store the listener function

        // Initial resize and listener setup
        resizeTimeoutIdRef.current = setTimeout(resizeCanvas, 50)
        window.addEventListener('resize', resizeCanvas)
        console.log(
          `[AnimationOverlay initialize] Resize listener added for ${sketchName}.`
        )
      } catch (err: unknown) {
        // Use unknown for better type safety
        let message = 'An unknown error occurred'
        if (err instanceof Error) {
          message = err.message
        } else if (typeof err === 'string') {
          message = err
        }
        console.error(
          `[AnimationOverlay initialize] CRITICAL Error initializing sketch "${sketchName}":`,
          err
        )
        if (isMounted) {
          setError(`Failed to initialize sketch: ${message}`)
        }
        cleanupP5() // Ensure cleanup on error
      }
    }

    initialize()

    return () => {
      isMounted = false
      // Cleanup is handled by the separate effect below or when sketchName changes
    }
  }, [sketchName, currentTheme, cleanupP5]) // Add cleanupP5 dependency

  // Effect specifically for cleanup when component unmounts
  useEffect(() => {
    return () => {
      console.log('[AnimationOverlay] Unmounting, running cleanup.')
      cleanupP5()
    }
  }, [cleanupP5])

  // Render null if sketchName is null (avoids rendering overlay during cleanup)
  if (!sketchName) return null

  return (
    <Overlay
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <CanvasContainer ref={containerRef} onClick={onClose}>
        {error && <StatusMessage>Error: {error}</StatusMessage>}
      </CanvasContainer>
    </Overlay>
  )
}

export default AnimationOverlay
