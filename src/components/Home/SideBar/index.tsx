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
    [name in SelectedSectionType]: React.FC | undefined
  } = {
    files: Files, // NOTE : Core/Editor
    source: Source, // NOTE : Releases/Features/Commits
    debug: Debug, // NOTE :  Play the sketchs
    search: Search, // NOTE : Search on downloaded files
    extensions: Extensions
  }

  const Section =
    (selectedSection !== 'profile' &&
      selectedSection !== 'settings' &&
      sections[selectedSection]) ||
    Files

  return (
    <Container>
      <NavBar />

      {!isMedium ? (
        <Main>
          <Section />
        </Main>
      ) : (
        <Modal setClose={() => setOpen(false)} open={open}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <Section />
          </ModalContent>
        </Modal>
      )}
    </Container>
  )
}

export default SideBar
