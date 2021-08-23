import Image from 'next/image'
import { Container } from './styled'
export type IconProps = {
  variant: string
  width: string
  height: string
}

const Icon: React.FC<IconProps> = ({
  variant,
  width = '50px',
  height = '50px'
}) => {
  const path = `/icons/${variant}.svg`
  return (
    <Container>
      <Image
        alt={variant}
        title={variant}
        src={path}
        width={width}
        height={height}
      />
    </Container>
  )
}

export default Icon
