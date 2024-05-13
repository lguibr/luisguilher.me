import { Container } from './styled'
import Text from 'src/components/Core/Text'
import Image from 'next/image'
import { useWindowSize } from 'src/hooks/useWindow'
const TopBar: React.FC = () => {
  const { isMedium } = useWindowSize()
  return (
    <Container>
      <Image height="20" width="20" src="/favicon.png" />
      <Text size={13}>luisguilher.me - Visual Profile Code</Text>
      {!isMedium && <Text size={13}>Luís Guilherme Pelin Martins</Text>}
    </Container>
  )
}

export default TopBar
