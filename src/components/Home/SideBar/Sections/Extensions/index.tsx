import { sketchs } from 'src/components/Core/Sketchs'
import Text from 'src/components/Core/Text'
import { useAnimationContext } from 'src/hooks/useAnimationContext' // Import new hook
import { Container } from './styled'
import Image from 'next/image'

const Extensions: React.FC = () => {
  const { playAnimation, animationState } = useAnimationContext() // Use animation context

  return (
    <div>
      {sketchs?.map(sketch => (
        <Container
          key={sketch.name}
          onClick={() =>
            !animationState.isVisible &&
            playAnimation(sketch.name, { duration: 5000 }) // Use playAnimation with sketch name
          }
        >
          <div>
            <Image
              width={50}
              height={50}
              src={sketch.icon ? sketch.icon : '/icons/linear.png'}
              alt={`${sketch.name} icon`} // Add alt text
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