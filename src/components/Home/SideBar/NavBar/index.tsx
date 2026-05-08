import Icon from 'src/components/Core/Icons'
import { Section, Option, Container, Badge } from './styled'
import useSideBar from 'src/hooks/useSideBar'
import FloatMenu from 'src/components/Core/FloatMenu'
import useContextTheme from 'src/hooks/useContextTheme'
import useContextFile from 'src/hooks/useContextFile'
import { useContextPrint } from 'src/hooks/useContextPrint'
import { useState, useEffect } from 'react'
import { sketchs } from 'src/assets/sketchMetadata' // <--- UPDATED IMPORT PATH
import dynamic from 'next/dynamic'
import { useL0g1n } from 'l0g1n-sdk'
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth'
import { toast } from 'sonner'
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
  | 'download'

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
  const { user, signInWithGithub, auth, logOut } = useL0g1n()
  const { toggleTheme } = useContextTheme()
  const { selectedSection, setSelectedSection, setOpen, open } = useSideBar()
  const { diffFiles } = useContextFile()
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

  useEffect(() => {
    // Play random animation on mount (first load)
    playRandomAnimation()

    // Close it after 1.5 seconds
    const timer = setTimeout(() => {
      setShowDebugAnimation(false)
      setDebugSketchName(null)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

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
        },
        ...(user
          ? [
              {
                labels: [`Logged in: ${user.email}`],
                onClick: () => undefined
              },
              {
                labels: [
                  typeof window !== 'undefined' &&
                  localStorage.getItem('GIG_GITHUB_TOKEN')
                    ? 'GitHub: Connected'
                    : 'Connect GitHub (API)'
                ],
                onClick: async () => {
                  if (auth) {
                    try {
                      const provider = new GithubAuthProvider()
                      // provider.addScope('repo')
                      const result = await signInWithPopup(auth, provider)

                      console.log('[NavBar] GitHub Connection Result:', result)
                      const credential =
                        GithubAuthProvider.credentialFromResult(result)
                      if (credential?.accessToken) {
                        localStorage.setItem(
                          'GIG_GITHUB_TOKEN',
                          credential.accessToken
                        )
                        console.log(
                          '[NavBar] GIG_GITHUB_TOKEN saved to localStorage'
                        )
                        window.location.reload()
                      } else {
                        console.warn(
                          '[NavBar] No accessToken found in credential'
                        )
                      }
                    } catch (error: unknown) {
                      console.error('[NavBar] GitHub Auth Error:', error)
                      toast.error(
                        `Auth failed: ${
                          (error as Error).message || 'Unknown error'
                        }`
                      )
                    }
                  }
                }
              },
              {
                labels: ['Logout'],
                onClick: async () => {
                  await logOut()
                  localStorage.removeItem('GIG_GITHUB_TOKEN')
                }
              }
            ]
          : [])
      ]
    },

    {
      variant: 'settings',
      options: [
        {
          labels: ['Toggle theme'],
          onClick: () => toggleTheme()
        },
        ...(user
          ? [
              {
                labels: [`Logged in: ${user.email}`],
                onClick: () => undefined
              },
              {
                labels: [
                  typeof window !== 'undefined' &&
                  localStorage.getItem('GIG_GITHUB_TOKEN')
                    ? 'GitHub: Connected'
                    : 'Connect GitHub (API)'
                ],
                onClick: async () => {
                  if (auth) {
                    try {
                      const provider = new GithubAuthProvider()
                      // provider.addScope('repo')
                      const result = await signInWithPopup(auth, provider)
                      const credential =
                        GithubAuthProvider.credentialFromResult(result)
                      if (credential?.accessToken) {
                        localStorage.setItem(
                          'GIG_GITHUB_TOKEN',
                          credential.accessToken
                        )
                        console.log('[NavBar] GitHub Token captured and saved.')
                        window.location.reload() // Reload to refresh service state
                      }
                    } catch (error: unknown) {
                      console.error('[NavBar] GitHub Auth Error:', error)
                      toast.error(
                        `Auth failed: ${
                          (error as Error).message || 'Unknown error'
                        }`
                      )
                    }
                  }
                }
              },
              {
                labels: ['Logout'],
                onClick: async () => {
                  await logOut()
                  localStorage.removeItem('GIG_GITHUB_TOKEN')
                }
              }
            ]
          : [
              {
                labels: ['Login via GitHub (Bypass API Limits)'],
                onClick: async () => {
                  if (auth) {
                    try {
                      const provider = new GithubAuthProvider()
                      // provider.addScope('repo')
                      const result = await signInWithPopup(auth, provider)
                      const credential =
                        GithubAuthProvider.credentialFromResult(result)
                      if (credential?.accessToken) {
                        localStorage.setItem(
                          'GIG_GITHUB_TOKEN',
                          credential.accessToken
                        )
                        console.log('[NavBar] GitHub Token captured and saved.')
                      }
                    } catch (error: unknown) {
                      console.error('[NavBar] GitHub Login Error:', error)
                      toast.error(
                        `Login failed: ${
                          (error as Error).message || 'Unknown error'
                        }`
                      )
                      signInWithGithub()
                    }
                  }
                }
              }
            ])
      ]
    },

    {
      variant: 'download',
      onClick: () => {
        print && print()
      }
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
              {option.variant === 'source' && diffFiles.length > 0 && (
                <Badge>{diffFiles.length}</Badge>
              )}
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
              {option.options ? (
                <FloatMenu options={option?.options}>
                  <Icon variant={option.variant} height="30px" width="30px" />
                </FloatMenu>
              ) : (
                <div
                  onClick={option.onClick}
                  style={{ cursor: 'pointer', display: 'flex' }}
                >
                  <Icon variant={option.variant} height="30px" width="30px" />
                </div>
              )}
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
