import { useEffect, useRef } from 'react' // Ensure React is imported first
import { Container, Canvas } from './styled'
import { useTheme } from 'styled-components'
import theme from 'src/styles/theme'
import type { SketchFactory } from 'src/components/Core/Sketchs'
import type P5 from 'p5' // Import P5 type only

type Theme = typeof theme['vs-dark']

interface CanvasProps {
  sketchCanvas?: SketchFactory
}

const CanvasComponent: React.FC<CanvasProps> = ({ sketchCanvas }) => {
  const p5Ref = useRef<HTMLDivElement | null>(null)
  const parentRef = useRef<HTMLDivElement | null>(null)
  const p5InstanceRef = useRef<P5 | null>(null) // Use ref for instance
  const currentTheme = useTheme()

  // Removed unused dimensions state

  // Effect to create P5 instance
  useEffect(() => {
    let isMounted = true // Track mount status

    const initializeP5 = async () => {
      // Only create instance if a sketch factory is provided and refs are available
      if (sketchCanvas && parentRef?.current && p5Ref?.current && isMounted) {
        try {
          console.log('[CanvasComponent] Dynamically importing P5...')
          const P5 = (await import('p5')).default // Dynamic import
          console.log('[CanvasComponent] P5 imported.')

          if (!p5Ref.current || !isMounted) {
            console.log(
              '[CanvasComponent] Ref gone or unmounted before P5 creation.'
            )
            return
          }

          // Clean up previous instance if sketchCanvas changes
          if (p5InstanceRef.current) {
            console.log('[CanvasComponent] Removing previous P5 instance.')
            p5InstanceRef.current.remove()
            p5InstanceRef.current = null
          }

          const sketchFunction = sketchCanvas(currentTheme as Theme)
          const instance = new P5(sketchFunction, p5Ref.current)
          p5InstanceRef.current = instance // Store in ref
          console.log('[CanvasComponent] P5 instance created.')

          // Initial resize after instance creation
          if (parentRef.current) {
            const { clientWidth, clientHeight } = parentRef.current
            if (clientWidth > 0 && clientHeight > 0) {
              instance.resizeCanvas(clientWidth, clientHeight)
              if (typeof instance.windowResized === 'function') {
                instance.windowResized()
              }
              // Removed setDimensions call
            }
          }
        } catch (error) {
          console.error('Error creating P5 instance in CanvasComponent:', error)
          p5InstanceRef.current = null
        }
      } else {
        // Cleanup if sketchCanvas is removed or refs are missing
        if (p5InstanceRef.current) {
          console.log('[CanvasComponent] Removing P5 instance (no sketch/ref).')
          p5InstanceRef.current.remove()
          p5InstanceRef.current = null
        }
      }
    }

    initializeP5()

    // Cleanup function to remove the P5 instance
    return () => {
      isMounted = false
      if (p5InstanceRef.current) {
        console.log('[CanvasComponent] Removing P5 instance on cleanup.')
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
    // Depend on sketchCanvas and theme
  }, [sketchCanvas, currentTheme])

  // ResizeObserver logic
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { contentRect } = entry
      const newWidth = contentRect?.width
      const newHeight = contentRect?.height
      if (p5InstanceRef.current && newWidth && newHeight) {
        p5InstanceRef.current.resizeCanvas(newWidth, newHeight)
        if (typeof p5InstanceRef.current.windowResized === 'function') {
          p5InstanceRef.current.windowResized()
        }
        // Removed setDimensions call
      }
    })

    let parentElement: HTMLDivElement | null = null
    if (parentRef.current) {
      parentElement = parentRef.current
      observer.observe(parentElement)
    }

    return () => {
      if (parentElement) {
        observer.unobserve(parentElement)
      }
      observer.disconnect()
    }
  }, []) // No dependency on p5InstanceRef to avoid re-observing unnecessarily

  // Only render the container if a sketch is supposed to be there
  if (!sketchCanvas) {
    return null // Or a placeholder if needed
  }

  return (
    <Container ref={parentRef}>
      <Canvas ref={p5Ref} />
    </Container>
  )
}

export default CanvasComponent
