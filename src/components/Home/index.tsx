import SideBar from './SideBar'
import TopBar from './TopBar'
import { Container, Content, StyledResizeHandle } from './styled'
import { PanelGroup, Panel } from 'react-resizable-panels'

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
          <PanelGroup
            direction="horizontal"
            id="home-layout"
            style={{ height: '100%', width: '100%' }}
          >
            <Panel
              defaultSize={20}
              minSize={15}
              maxSize={40}
              order={1}
              id="sidebar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <SideBar />
            </Panel>
            <StyledResizeHandle />
            <Panel
              order={2}
              id="content"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              {/* Only render FileViewComponent on the client */}
              {isClient && <FileViewComponent id={rootId} />}
            </Panel>
          </PanelGroup>
        </Content>
        <Footer />
      </Container>
    </>
  )
}

export default Home
