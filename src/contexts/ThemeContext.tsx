import { createContext, useState } from 'react'

type SelectedThemeType = 'light' | 'vs-dark'

export type ThemeContextType = {
  selectedTheme: SelectedThemeType
  toggleTheme: () => void
}

export const ThemeContext = createContext({} as ThemeContextType)

export const UIProvider: React.FC = ({ children }) => {
  const [selectedTheme, setTheme] = useState<SelectedThemeType>('vs-dark')

  const toggleTheme = () => {
    const newTheme = selectedTheme === 'light' ? 'vs-dark' : 'light'
    setTheme(newTheme)
  }
  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
