import Icon from 'src/components/Core/Icons'
import { Section, Option, Container } from './styled'
import useSideBar from 'src/hooks/useSideBar'
import FloatMenu from 'src/components/Core/FloatMenu'
import useContextTheme from 'src/hooks/useContextTheme'
import { useContextPrint } from 'src/hooks/useContextPrint'
import { useContextGuideTour } from 'src/hooks/useGuideTour'
import { useState } from 'react'
import { sketchs } from 'src/assets/sketchMetadata' // <--- UPDATED IMPORT PATH
import dynamic from 'next/dynamic'

// Dynamically import AnimationOverlay, disable SSR
const DynamicAnimationOverlay = dynamic(
  () => import('src/components/Core/AnimationOverlay'),
  { ssr: false }
)

type Variant =
  | 'files'
  | 'search'
  | 'source'
  | 'debug'
  | 'extensions'
  | 'profile'
  | 'settings'

type OptionType = {
  variant: Variant
  onClick?: () => void
}

interface OptionMenu extends OptionType {
  options?: {
    labels: string[]
    onClick: () => void
  }[]
}

const NavBar: React.FC = () => {
  const { toggleTheme } = useContextTheme()
  const { setTour } = useContextGuideTour()
  const { selectedSection, setSelectedSection, setOpen, open } = useSideBar()
  const [showDebugAnimation, setShowDebugAnimation] = useState(false)
  const [debugSketchName, setDebugSketchName] = useState<string | null>(null)

  const playRandomAnimation = () => {
    console.log('[NavBar] playRandomAnimation called.')
    console.log('[NavBar] Checking sketchs value:', sketchs)
    if (Array.isArray(sketchs) && sketchs.length > 0) {
      const randomIndex = Math.floor(Math.random() * sketchs.length)
      const randomSketch = sketchs[randomIndex]
      if (randomSketch) {
        const sketchToPlay = randomSketch.name
        console.log(`[NavBar] Random sketch selected: ${sketchToPlay}`)
        console.log(
          `[NavBar] Setting state: debugSketchName=${sketchToPlay}, showDebugAnimation=true`
        )
        setDebugSketchName(sketchToPlay)
        setShowDebugAnimation(true)
      } else {
        console.error(
          '[NavBar] Could not select a random sketch (index issue?).'
        )
      }
    } else {
      console.warn(
        '[NavBar] No sketches available or sketchs not loaded correctly yet.'
      )
    }
  }

  const menuOptions: OptionType[] = [
    { variant: 'files' },
    { variant: 'search' },
    { variant: 'source' },
    {
      variant: 'debug',
      onClick: playRandomAnimation
    },
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
    <>
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
      {showDebugAnimation && debugSketchName && (
        <DynamicAnimationOverlay
          key={debugSketchName}
          sketchName={debugSketchName}
          onClose={() => {
            setShowDebugAnimation(false)
            setDebugSketchName(null)
          }}
        />
      )}
    </>
  )
}

export default NavBar
