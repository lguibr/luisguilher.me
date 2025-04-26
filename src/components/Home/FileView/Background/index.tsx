// src/components/Home/FileView/Background/index.tsx
import { useEffect } from 'react'
import Text from 'src/components/Core/Text'
import useContextTheme from 'src/hooks/useContextTheme'
import useContextLoading from 'src/hooks/useLoading'
import { Container, Content, SpanHighlighted } from './styled' // Removed VS import
import { useContextPrint } from 'src/hooks/useContextPrint'
import { useWindowSize } from 'src/hooks/useWindow'
import { useContextGuideTour } from 'src/hooks/useGuideTour'
import Image from 'next/image' // Import next/image

const Background: React.FC = () => {
  const { setTour } = useContextGuideTour()
  const { isMedium } = useWindowSize()
  const { print } = useContextPrint()
  const { toggleTheme, selectedTheme } = useContextTheme()
  const { setLoading, loading } = useContextLoading() // Get setLoading

  const flashLoadingAnimation = () => {
    if (!loading) {
      setLoading(true) // Turn on loading (will pick random sketch)
      setTimeout(() => {
        setLoading(false) // Turn off loading after a short delay
      }, 1500) // Adjust delay as needed (e.g., 1500ms)
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    const { ctrlKey, key, shiftKey } = event

    if (ctrlKey) {
      switch (key.toLowerCase()) {
        case 'q':
          toggleTheme()
          break
        case 'p':
          print && print()
          break
        case ' ': // Check for space key
          flashLoadingAnimation() // Call the flash function
          break
        case '2': // Check for '2' key for tour restart
          if (shiftKey) {
            setTour(true)
          }
          break
        default:
          break
      }
      // Handle legacy Ctrl+@ for tour
      if (key === '@') {
        setTour(true)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyUp)
    return () => window.removeEventListener('keydown', handleKeyUp)
    // Ensure all dependencies are included
  }, [selectedTheme, loading, print, toggleTheme, setTour, setLoading]) // Added setLoading

  return (
    <Container>
      <Image
        src="/favicon.png"
        alt="Profile Favicon"
        width={isMedium ? 120 : 200}
        height={isMedium ? 120 : 200}
        data-tut="profile"
        priority
      />
      {!isMedium && (
        <Content>
          <Text size={13}>
            <span>
              Toggle Theme
              <SpanHighlighted as="span">CTRL</SpanHighlighted>+
              <SpanHighlighted as="span">Q</SpanHighlighted>
            </span>
          </Text>
          <Text size={13}>
            <span>
              Print / Download Resume
              <SpanHighlighted as="span">CTRL</SpanHighlighted>+
              <SpanHighlighted as="span">P</SpanHighlighted>
            </span>
          </Text>
          <Text size={13}>
            <span>
              Restart Tour
              <SpanHighlighted as="span">CTRL</SpanHighlighted>+
              <SpanHighlighted as="span">SHIFT</SpanHighlighted>+
              <SpanHighlighted as="span">2</SpanHighlighted>
            </span>
          </Text>
          <Text size={13}>
            <span>
              Flash a Loading Sketch
              <SpanHighlighted as="span">CTRL</SpanHighlighted>+
              <SpanHighlighted as="span">SPACE</SpanHighlighted>
            </span>
          </Text>
        </Content>
      )}
    </Container>
  )
}

export default Background
