import { createContext, useState, useEffect } from 'react'
import Step from 'src/components/Core/GuideTour/Step'
import { ReactourStep } from 'reactour'
import useContextSidebar from 'src/hooks/useSideBar'
import useFileViewsContext from 'src/hooks/useContextFileView'

export type GuideTourContextType = {
  steps: ReactourStep[]
  setTour: (loading: boolean) => void
  isTourOpen: boolean
}

export const GuideTourContext = createContext({} as GuideTourContextType)

export const GuideTourProvider: React.FC = ({ children }) => {
  const { setOpen, setSelectedSection } = useContextSidebar()
  const { openFile } = useFileViewsContext()
  const totalExperience = new Date().getFullYear() - 2016
  const steps = [
    {
      action: () => {
        setOpen(false)
      },
      content: (
        <Step
          title="Welcome"
          emoticon="❤️"
          content={`Welcome! This site is my brain disguised as a code editor. Explore it like a VS Code workspace of my career. 🚀`}
        />
      )
    },
    {
      action: () => {
        setOpen(false)
      },
      content: (
        <Step
          title="About Me"
          emoticon="👨‍💻"
          content={`I'm Luís Guilherme — AI systems engineer, physics enjoyer, and code architect. I’ve been shipping real stuff for ${totalExperience}+ years.`}
        />
      )
    },
    {
      selector: '[data-tut="nav0"]',
      action: () => {
        setOpen(true)
        setSelectedSection('files')
      },
      content: (
        <Step
          title="File Explorer"
          emoticon="📁"
          content={`Everything starts here. Projects, resume, experiments — treat it as the root folder of my career.`}
        />
      )
    },
    {
      selector: '[data-tut="extra2"]',
      action: () => {
        setOpen(false)
        setSelectedSection('files')
      },
      content: (
        <Step
          title="Resume / Source Code"
          emoticon="📔"
          content={`Prefer a classic PDF? Click here to download my resume. Otherwise, explore my career as Markdown files right here in the editor.`}
        />
      )
    },
    {
      action: () => {
        setOpen(true)
        setSelectedSection('files')
      },
      content: (
        <Step
          title="Thank You!"
          emoticon="👋"
          content={`That's it! Open anything, read freely. If something sparks an idea, hit me up! I’m open for new projects 💭`}
        />
      )
    }
  ]

  const [isTourOpen, setIsTourOpen] = useState(true)

  const setTour = (value: boolean) => {
    setIsTourOpen(value)
    localStorage.setItem('GUIDE_TOUR', JSON.stringify(value))
    if (value === false) {
      openFile('CURRICULUM.md', 0)
    }
  }

  useEffect(() => {
    const localStorageGuideTour = localStorage.getItem('GUIDE_TOUR')
    setTour(
      Boolean(
        localStorageGuideTour === null
          ? 'true'
          : localStorageGuideTour === 'true'
      )
    )
  }, [])

  return (
    <GuideTourContext.Provider
      value={{
        setTour,
        isTourOpen,
        steps
      }}
    >
      {children}
    </GuideTourContext.Provider>
  )
}
