import { Container } from './styled'
import dynamic from 'next/dynamic'
import useContextLoading from 'src/hooks/useLoading'
import { useRef } from 'react'

const Canvas = dynamic(import('./Canvas'), {
  ssr: false
})

const Loading: React.FC = () => {
  const engineRef = useRef<HTMLDivElement | null>(null)

  const { loading } = useContextLoading()
  return (
    <Container ref={engineRef} isLoading={!!loading}>
      {loading && <Canvas />}
    </Container>
  )
}

export default Loading
