import { Container, Background } from './styled'

export type ModalProps = {
  open?: boolean
  setClose: () => void
}

const Modal: React.FC<ModalProps> = ({ children, open, setClose }) => {
  return (
    <Container open={open}>
      <Background onClick={() => setClose()}>{children}</Background>
    </Container>
  )
}

export default Modal
