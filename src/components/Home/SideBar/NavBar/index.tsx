import Icon from 'src/components/Core/Icons'

import { Section, Option, Container } from './styled'
import useSideBar from 'src/hooks/useSideBar'
import FloatMenu from 'src/components/Core/FloatMenu'
import useContextTheme from 'src/hooks/useContextTheme'
import { useContextFile } from 'src/hooks/useContextFile'
import { useContextPrint } from 'src/hooks/useContextPrint'
import { useContextGuideTour } from 'src/hooks/useGuideTour'
import { useContextLoading } from 'src/hooks/useLoading'

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
  onClick?: () => void
}

interface OptionMenu extends Option {
  options?: {
    labels: string[]
    onClick: () => void
  }[]
}

const NavBar: React.FC = () => {
  const { flashLoading, loading } = useContextLoading()
  const { toggleTheme } = useContextTheme()
  const { setTour } = useContextGuideTour()
  const { closeAllFiles } = useContextFile()

  const { selectedSection, setSelectedSection, setOpen, open } = useSideBar()

  const menuOptions: Option[] = [
    { variant: 'files' },
    { variant: 'search' },
    { variant: 'source' },
    { variant: 'debug', onClick: () => !loading && flashLoading(5000) },
    { variant: 'extensions' }
  ]
  const { print } = useContextPrint()

  const menuExtras: OptionMenu[] = [
    {
      variant: 'profile',
      options: [
        {
          labels: ['Send me a Whatsapp'],
          onClick: () => {
            window.open(
              'https://web.whatsapp.com/send?phone=5537991640818&lang=en'
            )
          }
        },
        {
          labels: ['Send me a Email'],
          onClick: () => {
            window.open(
              'mailto:lgpelin92@gmail.com?subject=Contact from luisguilher.me'
            )
          }
        },
        {
          labels: ['Visit my Linkedin'],
          onClick: () => {
            window.open('https://www.linkedin.com/in/lguibr/')
          }
        },
        {
          labels: ['Visit my Github'],
          onClick: () => {
            window.open('https://github.com/lguibr')
          }
        },
        {
          labels: ['Print / Download Resume'],
          onClick: () => {
            print && print()
          }
        }
      ]
    },
    {
      variant: 'settings',
      options: [
        {
          labels: ['Toggle theme'],
          onClick: () => toggleTheme()
        },
        {
          labels: ['Restart the onboarding'],
          onClick: () => {
            closeAllFiles()
            setTour(true)
          }
        },
        {
          labels: ['Open project on Github'],
          onClick: () =>
            window?.open('https://github.com/lguibr/luisguilher.me')
        },
        {
          labels: ['Open a issue'],
          onClick: () =>
            window?.open('https://github.com/lguibr/luisguilher.me/issues/new')
        }
      ]
    }
  ]

  const handleClick = (selection: Variant): void => {
    const isSameSection = selectedSection === selection

    isSameSection && setOpen(!open)
    !isSameSection && setOpen(true)
    setSelectedSection(selection)
  }

  return (
    <Container>
      <Section>
        {menuOptions.map((option, index) => (
          <Option
            data-tut={`nav${index}`}
            isSelectedSection={selectedSection === option.variant}
            onClick={() => {
              handleClick(option.variant)
              option?.onClick && option?.onClick()
            }}
            key={option.variant}
          >
            <Icon variant={option.variant} height="30px" width="30px" />
          </Option>
        ))}
      </Section>
      <Section>
        {menuExtras.map((option, index) => (
          <Option
            data-tut={`extra${index}`}
            isSelectedSection={false}
            key={option.variant}
          >
            <FloatMenu options={option?.options}>
              <Icon variant={option.variant} height="30px" width="30px" />
            </FloatMenu>
          </Option>
        ))}
      </Section>
    </Container>
  )
}

export default NavBar
