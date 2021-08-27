import { Container, Content, Info } from './styled'
import Text from 'src/components/Core/Text'
import CheckIcon from 'public/icons/check.svg'
import SourceIcon from 'public/icons/source.svg'
import { useWindowSize } from 'src/hooks/useWindow'

const Footer: React.FC = () => {
  const { isMedium } = useWindowSize()
  return (
    <Container>
      <Content>
        <Info>
          <SourceIcon />
          <Text color="white" weight="600" size={13}>
            main
          </Text>
        </Info>
        <Info>
          <CheckIcon />
          <Text color="white" weight="600" size={13}>
            Typescript
          </Text>
        </Info>
      </Content>
      {!isMedium && (
        <Content>
          <Info>
            <CheckIcon />
            <Text color="white" weight="600" size={13}>
              ESLint
            </Text>
          </Info>
          <Info>
            <CheckIcon />
            <Text color="white" weight="600" size={13}>
              Prettier
            </Text>
          </Info>
        </Content>
      )}
    </Container>
  )
}

export default Footer
