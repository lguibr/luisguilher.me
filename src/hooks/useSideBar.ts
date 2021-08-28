import { useContext } from 'react'
import { SideBarContext, SideBasContextType } from 'src/contexts/SideBarContext'

export const useContextSidebar = (): SideBasContextType => {
  const SideBar = useContext(SideBarContext)
  return SideBar
}

export default useContextSidebar
