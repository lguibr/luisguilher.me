import Icon from 'src/components/Core/Icons'

import { Section, Option, Container } from './styled'
import useSideBar from 'src/hooks/useSideBar'

type Variant =
  | 'files'
  | 'search'
  | 'source'
  | 'debug'
  | 'extensions'
  | 'profile'
  | 'settings'

type Option = {
  variant: Variant
}

const menuOptions: Option[] = [
  { variant: 'files' },
  { variant: 'search' },
  { variant: 'source' },
  { variant: 'debug' },
  { variant: 'extensions' }
]

const menuExtras: Option[] = [{ variant: 'profile' }, { variant: 'settings' }]

const NavBar: React.FC = () => {
  const { selectedSection, setSelectedSection, setOpen, open } = useSideBar()

  const handleClick = (selection: Variant): void => {
    const isSameSection = selectedSection === selection

    isSameSection && setOpen(!open)
    !isSameSection && setOpen(true)
    setSelectedSection(selection)
  }

  return (
    <Container>
      <Section>
        {menuOptions.map(option => (
          <Option
            isSelectedSection={selectedSection === option.variant}
            onClick={() => handleClick(option.variant)}
            key={option.variant}
          >
            <Icon variant={option.variant} height="30px" width="30px" />
          </Option>
        ))}
      </Section>
      <Section>
        {menuExtras.map(option => (
          <Option
            isSelectedSection={false}
            onClick={() => console.log(option.variant)}
            key={option.variant}
          >
            <div>a</div>
            <Icon variant={option.variant} height="30px" width="30px" />
          </Option>
        ))}
      </Section>
    </Container>
  )
}

export default NavBar
