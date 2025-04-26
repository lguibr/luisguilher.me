import { sketchs } from 'src/assets/sketchMetadata' // <--- UPDATED IMPORT PATH
import Text from 'src/components/Core/Text'
import { Container } from './styled'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import AnimationOverlay, disable SSR
const DynamicAnimationOverlay = dynamic(
  () => import('src/components/Core/AnimationOverlay'),
  { ssr: false }
)

const Extensions: React.FC = () => {
  const [activeSketch, setActiveSketch] = useState<string | null>(null)

  useEffect(() => {
    console.log('[Extensions] Checking sketchs value on mount:', sketchs)
  }, [])

  const handleSketchClick = (name: string) => {
    console.log(`[Extensions] handleSketchClick called with: ${name}`)
    console.log('[Extensions] Checking sketchs value on click:', sketchs)
    if (!Array.isArray(sketchs)) {
      console.error('[Extensions] sketchs is not an array on click!')
      return
    }
    console.log(`[Extensions] Setting state: activeSketch=${name}`)
    setActiveSketch(name)
  }

  useEffect(() => {
    console.log(
      `[Extensions] activeSketch state confirmed updated to: ${activeSketch}`
    )
  }, [activeSketch])

  if (!Array.isArray(sketchs)) {
    console.warn(
      '[Extensions] sketchs array not available during render, rendering empty div.'
    )
    return <div>Loading extensions...</div>
  }

  return (
    <>
      <div>
        {sketchs.map(sketch => (
          <Container
            key={sketch.name}
            onClick={() => handleSketchClick(sketch.name)}
          >
            <div>
              <Image
                width={50}
                height={50}
                src={sketch.icon ? sketch.icon : '/icons/linear.png'}
                alt={`${sketch.name} icon`}
              />
            </div>

            <div>
              <Text weight="bold">{sketch.name}</Text>
              <Text size={12}>{sketch.description}</Text>
            </div>
          </Container>
        ))}
      </div>
      {activeSketch && (
        <DynamicAnimationOverlay
          key={activeSketch}
          sketchName={activeSketch}
          onClose={() => {
            console.log(`[Extensions] Closing overlay for: ${activeSketch}`)
            setActiveSketch(null)
          }}
        />
      )}
    </>
  )
}

export default Extensions
