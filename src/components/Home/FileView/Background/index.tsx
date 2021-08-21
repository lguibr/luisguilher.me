import { useEffect } from 'react'
import Text from 'src/components/Core/Text'

import { Container, ImageRounded } from './styled'
const Background: React.FC = () => {
  const handleKeyUp = (event: KeyboardEvent) => {
    const { ctrlKey, key } = event
    if (ctrlKey) {
      console.log({ key })
    }
  }
  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)
    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [])

  return (
    <Container>
      <ImageRounded src="/profile.jpeg" width="100px" height="100px" />
      <Text as="h1"> Welcome To my Profile</Text>
    </Container>
  )
}

export default Background
