import SideBar from './SideBar'
import TopBar from './TopBar'
import { Container, Content } from './styled'
import Footer from './Footer'
import FileViewComponent from './FileViewComponent'
import useFileViewsContext from 'src/hooks/useContextFileView'

const Home: React.FC = () => {
  const { getRootId } = useFileViewsContext()
  const rootId = getRootId()
  console.log('rootId', rootId)

  return (
    <Container>
      <TopBar />
      <Content>
        <SideBar />
        <FileViewComponent id={rootId} />
      </Content>
      <Footer />
    </Container>
  )
}

export default Home
