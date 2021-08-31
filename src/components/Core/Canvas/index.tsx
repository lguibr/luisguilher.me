import P5 from 'p5'

import Sketch from '../Sketchs'
import { useEffect, useRef, useState } from 'react'
import { Container, Canvas } from './styled'
import { useTheme } from 'styled-components'

import theme from 'src/styles/theme'
type Theme = typeof theme['vs-dark']
interface CanvasProps {
  index?: number
  sketchCanvas?: (theme: Theme) => (p5: P5) => void
}
const CanvasComponent: React.FC<CanvasProps> = ({ index, sketchCanvas }) => {
  console.log('rerender canvas')

  const p5Ref = useRef<HTMLDivElement | null>(null)
  const parentRef = useRef<HTMLDivElement | null>(null)
  const [canvas, setCanvas] = useState<P5 | null>(null)
  const theme = useTheme()

  const height = parentRef?.current?.clientHeight
  const width = parentRef?.current?.clientWidth

  console.log({ height })
  console.log({ width })

  const resizeObserver = new ResizeObserver(([entry]) => {
    const { contentRect } = entry

    const newWidth = contentRect?.width
    const newHeight = contentRect?.height

    canvas && canvas?.resizeCanvas(newWidth, newHeight)
  })

  if (parentRef && parentRef.current && typeof window !== 'undefined') {
    resizeObserver.observe(parentRef.current)
  }

  useEffect(() => {
    const randomIntFromInterval = (max = 1, min = 0) =>
      Math.floor(Math.random() * (max - min + 1) + min)

    const randomNumberSketchIndex =
      typeof index === 'number' && index >= 0
        ? index
        : randomIntFromInterval(Sketch.length - 1)

    const sketch = sketchCanvas || Sketch[randomNumberSketchIndex]

    parentRef?.current &&
      p5Ref?.current &&
      setCanvas(new P5(sketch(theme), p5Ref?.current))
  }, [parentRef])

  useEffect(() => {
    height && width && canvas && canvas?.resizeCanvas(width, height)
  }, [height, width])

  return (
    <Container ref={parentRef}>
      <Canvas ref={p5Ref} />
    </Container>
  )
}

export default CanvasComponent
