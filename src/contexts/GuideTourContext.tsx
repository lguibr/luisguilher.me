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
          content={`Welcome to my digital brain! This is a fully functional, IDE-like portfolio built entirely from scratch with Next.js and a custom Virtual File System.`}
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
          content={`I'm Luís Guilherme — Principal Full Stack Engineer, AI System Architect, and Physics graduate. I recently led AI infrastructure for a YC-backed startup, building autonomous agent networks and slashing LLM latency.`}
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
          content={`Everything starts here. Treat this like a VS Code workspace—open projects, inspect my architecture, and explore ${totalExperience}+ years of software engineering history.`}
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
          title="Interactive Sketches"
          emoticon="✨"
          content={`Click here to trigger my WebGL/Three.js interactive sketches! They demonstrate procedural generation, physics engines, and complex system simulations stemming from my Physics background.`}
        />
      )
    },
    {
      selector: '#ai-agent-tour',
      action: () => {
        setOpen(false)
      },
      content: (
        <Step
          title="AI Agent"
          emoticon="🤖"
          content={`Meet the embedded AI Agent on the right. It has full context of my entire repository and history. Ask it to explain my code, search for my work with LangGraph, or summarize my architectural decisions.`}
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
          content={`Need a standard PDF? Download my resume here. Otherwise, keep exploring the codebase!`}
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
          content={`Enjoy your stay! If my work sparks an idea or you're looking for a lead architect, let's connect. 💭`}
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
