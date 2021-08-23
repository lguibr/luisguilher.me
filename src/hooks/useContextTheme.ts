import { useContext } from 'react'
import { ThemeContext, ThemeContextType } from 'src/contexts/ThemeContext'

export const useContextTheme = (): ThemeContextType => {
  const EditorTheme = useContext(ThemeContext)
  return EditorTheme
}

export default useContextTheme
