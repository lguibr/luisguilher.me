import P5 from 'p5'

import Sketch from '../Sketchs'
import { useEffect, useRef, useState } from 'react'
import { Container, Canvas } from './styled'
let i = 0
const CanvasComponent: React.FC = () => {
  i++
  console.log('i', i)

  const p5Ref = useRef<HTMLDivElement | null>(null)
  const parentRef = useRef<HTMLDivElement | null>(null)
  const [canvas, setCanvas] = useState<P5 | null>(null)

  const height = parentRef?.current?.clientHeight || 200
  const width = parentRef?.current?.clientWidth || 200

  const resizeObserver = new ResizeObserver(([entry]) => {
    const { contentRect } = entry
    console.log('s')

    const newWidth = contentRect?.width
    const newHeight = contentRect?.height

    canvas && canvas?.resizeCanvas(newWidth - 20, newHeight - 20)
  })

  if (parentRef && parentRef.current && typeof window !== 'undefined') {
    resizeObserver.observe(parentRef.current)
  }

  useEffect(() => {
    const randomIntFromInterval = (max = 1, min = 0) => {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const randomNumberSketchIndex = randomIntFromInterval(Sketch.length - 1)

    console.log({ randomNumberSketchIndex })
    const sketch = Sketch[randomNumberSketchIndex](setCanvas)
    p5Ref?.current && setCanvas(new P5(sketch, p5Ref?.current))
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      canvas && canvas?.resizeCanvas(width, height)
    }, 500)
    return () => clearTimeout(debounce)
  }, [height, width])

  return (
    <Container ref={parentRef}>
      <Canvas ref={p5Ref} />
    </Container>
  )
}

export default CanvasComponent
