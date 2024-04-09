import { useEffect } from 'react'
import Text from 'src/components/Core/Text'
import useContextTheme from 'src/hooks/useContextTheme'
import useContextLoading from 'src/hooks/useLoading'
import { Container, Content, VS, SpanHighlighted } from './styled'
import { useContextPrint } from 'src/hooks/useContextPrint'
import { useWindowSize } from 'src/hooks/useWindow'
import { useContextGuideTour } from 'src/hooks/useGuideTour'
const Background: React.FC = () => {
  const { setTour } = useContextGuideTour()
  const { isMedium } = useWindowSize()
  const { print } = useContextPrint()
  const { toggleTheme, selectedTheme } = useContextTheme()
  const { flashLoading, loading } = useContextLoading()

  const handleKeyUp = (event: KeyboardEvent) => {
    const { ctrlKey, key } = event

    if (ctrlKey) {
      key === 'Q' && toggleTheme()
      key === 'q' && toggleTheme()
      key === 'p' && print && print()
      key === 'P' && print && print()
      key === '@' &&
        (() => {
          setTour(true)
        })()
      key === ' ' && !loading && flashLoading()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyUp)
    return () => window.removeEventListener('keydown', handleKeyUp)
  }, [selectedTheme, loading])

  return (
    <Container>
      <VS data-tut="profile" />
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
              <SpanHighlighted as="span">ALT</SpanHighlighted>+
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
