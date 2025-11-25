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
  const age = new Date().getFullYear() - 1992
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
          content={`Greetings! Welcome to my page, dedicated to my favorite IDE, Visual Studio Code. Let's start our journey!`}
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
          title="About Me"
          emoticon="👨‍💻"
          content={`I'm Luís Guilherme, a developer with ${age} years, and more than ${totalExperience} years of experience as Software Engineer specialized in Web Applications. 
          I love physics, cats, and games. Let's dive in!`}
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
          content={`Explore the project's file structure here. Everything you need is just a click away.`}
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
          title="My Resume"
          emoticon="📔"
          content={`Check out my resume, organized in sections as JSON files or in a single compact YAML file.`}
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
          title="Source Code"
          emoticon="💾"
          content={`Here you can review the entire source code of this app. Feel free to explore!`}
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
          title="Search"
          emoticon="🔍"
          content={`Quickly find and replace text across all loaded files using this powerful search feature.`}
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
          title="Source Control"
          emoticon="🔤"
          content={`Track all changes made to files here. Version control made simple.`}
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
          title="Debug"
          emoticon="⏯️"
          content={`Start debugging your code with a click. Watch random sketch animations to add some fun!`}
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
          title="Extensions"
          emoticon="🎬"
          content={`Explore a variety of extensions to enhance your development experience.`}
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
          title="Profile"
          emoticon="🤓"
          content={`Access all my contact information here. You can also download or print my resume as a PDF by pressing CTRL + P`}
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
          title="Settings"
          emoticon="⚙️"
          content={`Customize the theme, open the project on GitHub, star it, or report an issue. Your feedback is valuable!`}
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
          content={`Thank you for exploring! Let's connect. May the force be with you!`}
        />
      )
    }
  ]

  const [isTourOpen, setIsTourOpen] = useState(true)

  const setTour = (value: boolean) => {
    setIsTourOpen(value)
    localStorage.setItem('GUIDE_TOUR', JSON.stringify(value))
    if (value === false) {
      openFile('README.md', 0)
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
