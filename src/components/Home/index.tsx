import FileView from './FileView'
import SideBar from './SideBar'
import Navigation from './Navigation'
import TopBar from './TopBar'
import { Container, Content, Main, FileContainer } from './styled'
import Loading from 'src/components/Core/Loading'
import { SideBarProvider } from 'src/contexts/SideBarContext'
import Footer from './Footer'
const Home: React.FC = () => {
  return (
    <SideBarProvider>
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
    </SideBarProvider>
  )
}

export default Home
