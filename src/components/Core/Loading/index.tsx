import { Container } from './styled'
import dynamic from 'next/dynamic'
import useContextLoading from 'src/hooks/useLoading'
import { useRef } from 'react'

const Canvas = dynamic(import('../Canvas'), {
  ssr: false
})

const Loading: React.FC = () => {
  const engineRef = useRef<HTMLDivElement | null>(null)

  const { loading, index } = useContextLoading()
  return (
    <Container ref={engineRef} isLoading={!!loading}>
      {loading && <Canvas index={index} />}
    </Container>
  )
}

export default Loading
