import { createContext, useState, useEffect } from 'react'

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
    localStorage.setItem('THEME', newTheme)
    setTheme(newTheme)
  }

  useEffect(() => {
    const localStorageTheme = localStorage.getItem('THEME') as SelectedThemeType
    const theme: SelectedThemeType = localStorageTheme || 'vs-dark'
    theme && setTheme(theme)
  }, [])

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
