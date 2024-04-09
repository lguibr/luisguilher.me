import SideBar from './SideBar'
import TopBar from './TopBar'
import { Container, Content } from './styled'
import Footer from './Footer'
import FileViewComponent from './FileViewComponent'
import useFileViewsContext from 'src/hooks/useContextFileView'
import useContextPrint from 'src/hooks/useContextPrint'

const Home: React.FC = () => {
  const { getRootId } = useFileViewsContext()
  const rootId = getRootId()
  console.log('rootId', rootId)
  const { Printable } = useContextPrint()

  return (
    <>
      <Printable />
      <Container>
        <TopBar />
        <Content>
          <SideBar />
          <FileViewComponent id={rootId} />
        </Content>
        <Footer />
      </Container>
    </>
  )
}

export default Home
