import { createContext, useState, useEffect } from 'react'
import Step from 'src/components/Core/GuideTour/Step'
import { ReactourStep } from 'reactour'
import useContextSidebar from 'src/hooks/useSideBar'

export type GuideTourContextType = {
  steps: ReactourStep[]
  setTour: (loading: boolean) => void
  isTourOpen: boolean
}

export const GuideTourContext = createContext({} as GuideTourContextType)

export const GuideTourProvider: React.FC = ({ children }) => {
  const { setOpen, setSelectedSection } = useContextSidebar()

  const steps = [
    {
      action: () => {
        setOpen(false)
      },
      content: (
        <Step
          title="Welcome"
          emoticon="❤️"
          content={`Hello! Welcome to my page, a tribute to my favorite IDE, the Visual Studio Code`}
        />
      )
    },
    {
      selector: '[data-tut="profile"]',
      action: () => {
        setOpen(false)
      },
      content: (
        <Step
          title="Presentation"
          emoticon="👨‍💻"
          content={`My name is Luís Guilherme I'm a ${
            new Date().getFullYear() - 1992
          } years old dev, passionate about physics, cats and games `}
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
          title="Section File Explorer"
          emoticon="📁"
          content={`This project have a cool file explorer ...`}
        />
      )
    },
    {
      selector: '[data-tut="resume_folder"]',
      action: () => {
        setOpen(true)
        setSelectedSection('files')
      },
      content: (
        <Step
          title="File Explorer - My Resume "
          emoticon="📔"
          content={`Here you can explore my resume in sections as JSON files or in one single compact YAML file`}
        />
      )
    },
    {
      selector: '[data-tut="repo_folder"]',
      action: () => {
        setOpen(true)
        setSelectedSection('files')
      },
      content: (
        <Step
          title="File Explorer - Code Source "
          emoticon="💾"
          content={`and here you can check all the source code of this app `}
        />
      )
    },
    {
      selector: '[data-tut="nav1"]',
      action: () => {
        setOpen(true)
        setSelectedSection('search')
      },
      content: (
        <Step
          title="Section : Search "
          emoticon="🔍"
          content={`You can find and replace text from all loaded files`}
        />
      )
    },
    {
      selector: '[data-tut="nav2"]',
      action: () => {
        setOpen(true)
        setSelectedSection('source')
      },
      content: (
        <Step
          title="Section : Source Control"
          emoticon="🔤"
          content={`All changes made in files can be tracked here`}
        />
      )
    },
    {
      selector: '[data-tut="nav3"]',
      action: () => {
        setOpen(true)
        setSelectedSection('debug')
      },
      content: (
        <Step
          title="Section : Debug Play"
          emoticon="⏯️"
          content={`Click here and you will see a random sketch animation`}
        />
      )
    },
    {
      selector: '[data-tut="nav4"]',
      action: () => {
        setOpen(true)
        setSelectedSection('extensions')
      },
      content: (
        <Step
          title="Section : Extensions"
          emoticon="🎬"
          content={`You can also explore a list of all animations `}
        />
      )
    },
    {
      selector: '[data-tut="extra0"]',
      action: () => {
        setOpen(false)
        setSelectedSection('files')
      },
      content: (
        <Step
          title="Section : Profile"
          emoticon="🤓"
          content={`Here you can access all my contact information and download/print my resume as a pdf`}
        />
      )
    },
    {
      selector: '[data-tut="extra1"]',
      action: () => {
        setOpen(false)
        setSelectedSection('files')
      },
      content: (
        <Step
          title="Section : Settings"
          emoticon="⚙️"
          content={`Here you can change the theme, open the project on Github and give me a little star or report an issue, both will help and make me happy!`}
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
          emoticon="👾"
          content={`Hope we can connect, may the force be with you !`}
        />
      )
    }
  ]

  const [isTourOpen, setIsTourOpen] = useState(true)

  const setTour = (value: boolean) => {
    setIsTourOpen(value)
    localStorage.setItem('GUIDE_TOUR', JSON.stringify(value))
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
        steps: steps
      }}
    >
      {children}
    </GuideTourContext.Provider>
  )
}
