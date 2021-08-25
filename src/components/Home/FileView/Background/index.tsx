import { useEffect } from 'react'
import Text from 'src/components/Core/Text'
import useContextFile from 'src/hooks/useContextFile'
import useContextTheme from 'src/hooks/useContextTheme'
import useContextLoading from 'src/hooks/useLoading'
import { Container, Content, VS, SpanHighlighted } from './styled'

const Background: React.FC = () => {
  const { closeAllFiles } = useContextFile()
  const { toggleTheme, selectedTheme } = useContextTheme()
  const { flashLoading, loading } = useContextLoading()
  useEffect(() => {
    console.log({ loading })
  }, [loading])
  const handleKeyUp = (event: KeyboardEvent) => {
    const { ctrlKey, key } = event

    if (ctrlKey) {
      console.log({ key })
      key === '$' && closeAllFiles()
      key === 'q' && toggleTheme()
      key === 'i' && console.log('print!')
      key === '!' && console.log('restart tour')
      key === '!' && console.log('restart tour')
      key === ' ' && !loading && flashLoading()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyUp)
    return () => window.removeEventListener('keydown', handleKeyUp)
  }, [selectedTheme, loading])

  return (
    <Container>
      <VS />
      <Content>
        <Text size={13}>
          <span>
            Print / Download Resume
            <SpanHighlighted as="span">CTRL</SpanHighlighted>+
            <SpanHighlighted as="span">i</SpanHighlighted>
          </span>
        </Text>
        <Text size={13}>
          <span>
            Close All Tabs
            <SpanHighlighted as="span">CTRL</SpanHighlighted>+
            <SpanHighlighted as="span">SHIFT</SpanHighlighted>+
            <SpanHighlighted as="span">4</SpanHighlighted>
          </span>
        </Text>
        <Text size={13}>
          <span>
            Toggle Theme
            <SpanHighlighted as="span">CTRL</SpanHighlighted>+
            <SpanHighlighted as="span">Q</SpanHighlighted>
          </span>
        </Text>

        <Text size={13}>
          <span>
            Restart Tour
            <SpanHighlighted as="span">CTRL</SpanHighlighted>+
            <SpanHighlighted as="span">SHIFT</SpanHighlighted>+
            <SpanHighlighted as="span">1</SpanHighlighted>
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
    </Container>
  )
}

export default Background
