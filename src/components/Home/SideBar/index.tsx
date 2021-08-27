import { Container, Main, ModalContent } from './styled'
import Files from './Sections/Files'
import Search from './Sections/Search'
import Source from './Sections/Source'
import Debug from './Sections/Debug'
import Extensions from './Sections/Extensions'

import NavBar from './NavBar'
import useWindowSize from 'src/hooks/useWindow'
import Modal from 'src/components/Core/Modal'
import useSideBar from 'src/hooks/useSideBar'

type SelectedSectionType =
  | 'files'
  | 'search'
  | 'source'
  | 'debug'
  | 'extensions'

const SideBar: React.FC = () => {
  const { open, setOpen, selectedSection } = useSideBar()
  const { isMedium } = useWindowSize()

  const sections: {
    [name in SelectedSectionType]: {
      component?: React.FC | undefined
      onClick?: () => void
    }
  } = {
    files: { component: Files }, // NOTE : Core/Editor
    source: { component: Source }, // NOTE : Releases/Features/Commits
    debug: {}, // NOTE :  Play the sketchs
    extensions: { component: Extensions },
    search: { component: Search } // NOTE : Search on downloaded files
  }

  const Section =
    selectedSection !== 'profile' &&
    selectedSection !== 'settings' &&
    sections[selectedSection].component

  return (
    <Container>
      <NavBar />

      {!isMedium && Section ? (
        <Main>
          <Section />
        </Main>
      ) : (
        Section && (
          <Modal setClose={() => setOpen(false)} open={open}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <Section />
            </ModalContent>
          </Modal>
        )
      )}
    </Container>
  )
}

export default SideBar
