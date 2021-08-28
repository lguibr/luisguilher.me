import FileView from './FileView'
import SideBar from './SideBar'
import Navigation from './Navigation'
import TopBar from './TopBar'
import { Container, Content, Main, FileContainer } from './styled'
import Loading from 'src/components/Core/Loading'
import Footer from './Footer'
const Home: React.FC = () => {
  return (
    <Container>
      <TopBar />
      <Content>
        <SideBar />
        <Main>
          <Navigation />
          <FileContainer>
            <Loading />
            <FileView />
          </FileContainer>
        </Main>
      </Content>
      <Footer />
    </Container>
  )
}

export default Home
