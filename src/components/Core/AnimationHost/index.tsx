import P5 from 'p5'
import { useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import { Container, CanvasContainer } from './styled'
import { useAnimationContext } from 'src/hooks/useAnimationContext'
import { sketchs as sketchRegistry } from 'src/components/Core/Sketchs'
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

const AnimationHost: React.FC = () => {
  const { animationState, stopAnimation } = useAnimationContext()
  const { isVisible, sketchName } = animationState
  const theme = useTheme()

  const p5InstanceRef = useRef<P5 | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null) // Ref for the direct parent of the canvas

  useEffect(() => {
    // Cleanup function to remove the P5 instance
    const cleanup = () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }

    if (isVisible && sketchName && containerRef.current) {
      // Find the sketch factory function from the registry
      const sketchData = sketchRegistry.find(s => s.name === sketchName)
      const sketchFactory = sketchData?.component

      if (sketchFactory && typeof sketchFactory === 'function') {
        // Ensure previous instance is removed before creating a new one
        cleanup()

        // Create the P5 instance
        const sketchFunction = sketchFactory(theme as Theme) // Cast theme
        p5InstanceRef.current = new P5(sketchFunction, containerRef.current)

        // Initial resize
        const resizeCanvas = () => {
          if (p5InstanceRef.current && containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current
            p5InstanceRef.current.resizeCanvas(clientWidth, clientHeight)
          }
        }
        resizeCanvas() // Call immediately

        // Setup ResizeObserver
        const resizeObserver = new ResizeObserver(resizeCanvas)
        resizeObserver.observe(containerRef.current)

        // Return cleanup function for observer
        return () => {
          resizeObserver.disconnect()
          cleanup() // Ensure P5 instance is removed on component unmount or sketch change
        }
      } else {
        console.warn(`Sketch factory for "${sketchName}" not found or invalid.`)
        cleanup() // Cleanup if sketch is invalid
      }
    } else {
      cleanup() // Cleanup if not visible or no sketch name
    }

    // Explicitly return cleanup for effect dependencies
    return cleanup
  }, [isVisible, sketchName, theme]) // Rerun effect if visibility, sketch, or theme changes

  // Stop animation if the user clicks on the host background
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      stopAnimation()
    }
  }

  if (!isVisible) {
    return null // Don't render anything if not visible
  }

  return (
    <Container onClick={handleBackgroundClick}>
      {/* This inner div is where P5 attaches the canvas */}
      <CanvasContainer ref={containerRef} />
    </Container>
  )
}

export default AnimationHost