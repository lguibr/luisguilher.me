import SideBar from './SideBar'
import TopBar from './TopBar'
import { Container, Content } from './styled'
import Footer from './Footer'
import FileViewComponent from './FileViewComponent'
import useFileViewsContext from 'src/hooks/useContextFileView'
import useContextPrint from 'src/hooks/useContextPrint'
import { useState, useEffect } from 'react' // Import hooks

const Home: React.FC = () => {
  const { getRootId } = useFileViewsContext()
  const rootId = getRootId()
  const { Printable } = useContextPrint()
  const [isClient, setIsClient] = useState(false) // State to track client-side mount

  useEffect(() => {
    setIsClient(true) // Set to true once component mounts on the client
  }, [])

  return (
    <>
      <Printable />
      <Container>
        <TopBar />
        <Content>
          <SideBar />
          {/* Only render FileViewComponent on the client */}
          {isClient && <FileViewComponent id={rootId} />}
        </Content>
        <Footer />
      </Container>
    </>
  )
}

export default Home
