import { Container } from './styled'
import Text from 'src/components/Core/Text'
import { useContextTheme } from 'src/hooks/useContextTheme'

const TopBar: React.FC = () => {
  const { toggleTheme } = useContextTheme()
  return (
    <Container onClick={toggleTheme}>
      <Text>Change Theme</Text>
    </Container>
  )
}

export default TopBar
