import { Container } from './styled'
import useContextLoading from 'src/hooks/useLoading'
import { useAnimationContext } from 'src/hooks/useAnimationContext'
import { useEffect } from 'react'

// Note: AnimationHost is now rendered globally via _app.tsx or similar
// This component now only *triggers* the animation via context

const Loading: React.FC = () => {
  const { loading } = useContextLoading()
  const { playAnimation, stopAnimation, animationState } = useAnimationContext()

  useEffect(() => {
    if (loading) {
      // Play a default loading animation, maybe 'RandomWalker' or a specific one
      // Keep it running as long as `loading` is true
      if (!animationState.isVisible || animationState.options.duration) {
        playAnimation('RandomWalker') // No duration, keeps playing
      }
    } else {
      // Stop the animation only if it was started by this loading component
      // (i.e., it doesn't have a duration set by flashLoading)
      if (animationState.isVisible && !animationState.options.duration) {
        stopAnimation()
      }
    }
    // Ensure animation stops if component unmounts while loading
    return () => {
      if (animationState.isVisible && !animationState.options.duration) {
        stopAnimation()
      }
    }
  }, [loading, playAnimation, stopAnimation, animationState])

  // The visual part is handled by AnimationHost rendered elsewhere
  // This component might not need to render anything itself,
  // or just a minimal overlay if desired.
  // Returning null as AnimationHost handles the visual display globally.
  // If you wanted a loading indicator *only* within a specific area,
  // you'd render AnimationHost here conditionally instead of globally.
  return null // Or <Container isLoading={loading}></Container> if Container provides a background
}

export default Loading