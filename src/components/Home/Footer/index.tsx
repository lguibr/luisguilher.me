import { Container, Content, Info } from './styled'
import Text from 'src/components/Core/Text'
import { useState, useEffect } from 'react'

const Footer: React.FC = () => {
  const [text, setText] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const messages = [
    'Compiling...',
    'Downloading more RAM...',
    'Refactoring the universe...',
    'Debugging life...',
    'Asking Stack Overflow...',
    'Drinking coffee...',
    'Centering a div...',
    'Merging to main...'
  ]

  useEffect(() => {
    const currentMessage = messages[messageIndex]
    const typeSpeed = isDeleting ? 50 : 100

    const timer = setTimeout(() => {
      if (!isDeleting && text === currentMessage) {
        setTimeout(() => setIsDeleting(true), 1500)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setMessageIndex((prev: number) => (prev + 1) % messages.length)
      } else {
        setText(
          currentMessage.substring(0, text.length + (isDeleting ? -1 : 1))
        )
      }
    }, typeSpeed)

    return () => clearTimeout(timer)
  }, [text, isDeleting, messageIndex, messages])

  return (
    <Container>
      <Content>
        <Info>
          <Text color="white" weight="600" size={13}>
            <span>
              {text}
              <span style={{ opacity: 0.5 }}>|</span>
            </span>
          </Text>
        </Info>
      </Content>
      <Content>
        <Info>
          <Text color="white" weight="600" size={13}>
            Made with ❤️
          </Text>
        </Info>
      </Content>
    </Container>
  )
}

export default Footer
