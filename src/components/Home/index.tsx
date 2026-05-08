import SideBar from './SideBar'
import TopBar from './TopBar'
import { Container, Content, StyledResizeHandle } from './styled'
import { PanelGroup, Panel } from 'react-resizable-panels'

import Footer from './Footer'
import FileViewComponent from './FileViewComponent'
import useFileViewsContext from 'src/hooks/useContextFileView'
import useContextPrint from 'src/hooks/useContextPrint'
import { useState, useEffect } from 'react' // Import hooks
import AgentManager from 'src/components/Agent/AgentManager'
import {
  FloatingWrapper,
  BubbleButton,
  TooltipPreview
} from 'src/components/Agent/styled'

import useWindowSize from 'src/hooks/useWindow' // Import useWindowSize

const Home: React.FC = () => {
  const { getRootId } = useFileViewsContext()
  const rootId = getRootId()
  const { Printable } = useContextPrint()
  const [isClient, setIsClient] = useState(false) // State to track client-side mount
  const [isAgentOpen, setIsAgentOpen] = useState(false)
  const { isMedium } = useWindowSize() // Get window size

  useEffect(() => {
    setIsClient(true) // Set to true once component mounts on the client
  }, [])

  return (
    <>
      <Printable />
      <Container>
        <TopBar />
        <Content>
          {/* Render SideBar outside of PanelGroup on small screens */}
          {isMedium && <SideBar />}

          <PanelGroup
            direction={isMedium ? 'vertical' : 'horizontal'}
            id="home-layout"
            style={{ height: '100%', width: '100%' }}
          >
            {/* Render SideBar inside a resizable panel on large screens */}
            {!isMedium && (
              <>
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
                <StyledResizeHandle id="handle-sidebar" />
              </>
            )}

            <Panel
              defaultSize={isMedium ? 60 : 55}
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
            {isAgentOpen && (
              <>
                <StyledResizeHandle id="handle-agent" $isVertical={isMedium} />
                <Panel
                  defaultSize={isMedium ? 40 : 25}
                  minSize={20}
                  maxSize={isMedium ? 80 : 40}
                  order={3}
                  id="agent"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {isClient && (
                    <AgentManager onClose={() => setIsAgentOpen(false)} />
                  )}
                </Panel>
              </>
            )}
          </PanelGroup>

          {!isAgentOpen && isClient && (
            <FloatingWrapper>
              <BubbleButton onClick={() => setIsAgentOpen(true)}>
                <TooltipPreview>Preview</TooltipPreview>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/chat.svg" alt="AI Agent Chat" />
              </BubbleButton>
            </FloatingWrapper>
          )}
        </Content>
        <Footer />
      </Container>
    </>
  )
}

export default Home
