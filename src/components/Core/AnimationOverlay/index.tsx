// src/components/Core/AnimationOverlay/index.tsx
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
    // Also clear canvas from container manually if needed, although p5.remove() should handle it
    if (containerRef.current) {
      const canvas = containerRef.current.querySelector('canvas')
      if (canvas) {
        // canvas.remove(); // p5.remove() should do this, but being explicit can help debugging
      }
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

    // If an instance exists and its container has a canvas, clean it up first
    if (
      p5InstanceRef.current &&
      containerRef.current?.querySelector('canvas')
    ) {
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
          setError('Container ref missing during P5 initialization.') // More specific error
          return
        }
        const instance = new P5Constructor(sketchFunction, containerRef.current)
        p5InstanceRef.current = instance
        console.log(
          `[AnimationOverlay initialize] P5 instance CREATED successfully for: ${sketchName}`
        )

        const resizeCanvas = () => {
          if (p5InstanceRef.current && containerRef.current) {
            // Use container dimensions directly for resizing logic
            const containerWidth = containerRef.current.clientWidth
            const containerHeight = containerRef.current.clientHeight

            // Check for valid dimensions before resizing
            if (containerWidth > 0 && containerHeight > 0) {
              try {
                p5InstanceRef.current.resizeCanvas(
                  containerWidth,
                  containerHeight
                )
                if (typeof p5InstanceRef.current.windowResized === 'function') {
                  p5InstanceRef.current.windowResized() // Call sketch's resize logic
                }
                console.log(
                  `[AnimationOverlay resizeCanvas] Resized to ${containerWidth}x${containerHeight}`
                )
              } catch (resizeError) {
                console.error(
                  '[AnimationOverlay resizeCanvas] Error during canvas resize:',
                  resizeError
                )
                setError('Error resizing canvas.')
              }
            } else {
              console.warn(
                '[AnimationOverlay resizeCanvas] Invalid container dimensions, skipping resize.'
              )
            }
          } else {
            console.log(
              '[AnimationOverlay resizeCanvas] Resize skipped: No P5 instance or container.'
            )
          }
        }

        currentResizeListener.current = resizeCanvas // Store the listener function

        // Initial resize and listener setup
        resizeTimeoutIdRef.current = setTimeout(resizeCanvas, 50) // Short delay for layout settle
        window.addEventListener('resize', resizeCanvas)
        console.log(
          `[AnimationOverlay initialize] Resize listener added for ${sketchName}.`
        )
      } catch (err: unknown) {
        // Use unknown for better type safety
        let message = 'An unknown error occurred during initialization'
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
      console.log(
        `[AnimationOverlay useEffect Cleanup] Running cleanup for effect associated with ${sketchName}`
      )
      // Note: The main cleanup happens in the unmount effect or when sketchName changes triggering the outer logic
    }
  }, [sketchName, currentTheme, cleanupP5]) // Add cleanupP5 dependency

  // Effect specifically for cleanup when component unmounts
  useEffect(() => {
    return () => {
      console.log('[AnimationOverlay] Unmounting, running final cleanup.')
      cleanupP5()
    }
  }, [cleanupP5]) // Depend only on cleanupP5

  // Render null if sketchName is null (avoids rendering overlay during cleanup)
  if (!sketchName) return null

  return (
    <Overlay
      onClick={e => {
        // Only close if the click is directly on the overlay, not the canvas/container
        if (e.target === e.currentTarget) {
          console.log('[AnimationOverlay] Overlay clicked, calling onClose.')
          onClose()
        }
      }}
    >
      {/* Pass onClick to CanvasContainer too, to allow closing by clicking potentially empty space within it */}
      <CanvasContainer ref={containerRef} onClick={onClose}>
        {error && <StatusMessage>Error: {error}</StatusMessage>}
        {/* Canvas is rendered inside here by p5 */}
      </CanvasContainer>
    </Overlay>
  )
}

export default AnimationOverlay
