import { createContext, useState } from 'react'

export type SelectedSectionType =
  | 'files'
  | 'search'
  | 'source'
  | 'debug'
  | 'extensions'
  | 'profile'
  | 'settings'
  | 'download'

export type SideBasContextType = {
  open: boolean
  selectedSection: SelectedSectionType
  setOpen: (bool: boolean) => void
  setSelectedSection: (selectedSection: SelectedSectionType) => void
}

export const SideBarContext = createContext({} as SideBasContextType)

export const SideBarProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedSection, setSelectedSection] =
    useState<SelectedSectionType>('files')

  return (
    <SideBarContext.Provider
      value={{
        selectedSection,
        setSelectedSection,
        open,
        setOpen
      }}
    >
      {children}
    </SideBarContext.Provider>
  )
}
