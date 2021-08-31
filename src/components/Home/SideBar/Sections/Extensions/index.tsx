import { sketchs } from 'src/components/Core/Sketchs'
import Text from 'src/components/Core/Text'
import useContextLoading from 'src/hooks/useLoading'
import { Container } from './styled'
import Image from 'next/image'

const Extensions: React.FC = () => {
  const { flashLoading, loading } = useContextLoading()

  return (
    <div>
      {sketchs?.map((sketch, index) => (
        <Container
          key={sketch.name}
          onClick={() => !loading && flashLoading(5000, index)}
        >
          <div>
            <Image
              width={50}
              height={50}
              src={sketch.icon ? sketch.icon : '/icons/linear.png'}
            />
          </div>

          <div>
            <Text weight="bold">{sketch.name}</Text>
            <Text size={12}>{sketch.description}</Text>
          </div>
        </Container>
      ))}
    </div>
  )
}

export default Extensions
