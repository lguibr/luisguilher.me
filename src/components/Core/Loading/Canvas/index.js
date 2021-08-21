import P5 from 'p5'
import Sketch from '../Sketch'
import { useEffect, useRef, useState } from 'react'
import { Container, Canvas } from './styled'
const Engine = () => {
  const p5Ref = useRef(null)
  const parentRef = useRef(null)
  const [canvas, setCanvas] = useState()

  const height = parentRef?.current?.clientHeight || 200
  const width = parentRef?.current?.clientWidth || 200

  const resizeObserver = new ResizeObserver(([entry]) => {
    const { contentRect } = entry

    const newWidth = contentRect?.width
    const newHeight = contentRect?.height

    canvas && canvas.resize(newWidth - 20, newHeight - 20)
  })

  if (parentRef && parentRef.current && typeof window !== 'undefined') {
    resizeObserver.observe(parentRef.current)
  }

  const sketch = Sketch(setCanvas)

  useEffect(() => {
    return new P5(sketch, p5Ref.current)
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      canvas && canvas.resize(width, height)
    }, 500)
    return () => clearTimeout(debounce)
  }, [height, width])

  return (
    <Container ref={parentRef}>
      <Canvas ref={p5Ref} />
    </Container>
  )
}

export default Engine
