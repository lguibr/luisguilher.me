import { ThemeProvider } from 'styled-components'
import { useContextTheme } from 'src/hooks/useContextTheme'
import theme from 'src/styles/theme'
import AmbientBackground from 'src/components/Core/AmbientBackground'

const Shell: React.FC = ({ children }) => {
  const { selectedTheme } = useContextTheme()
  const currentTheme = theme[selectedTheme]
  return (
    <ThemeProvider theme={currentTheme}>
      <AmbientBackground />
      {children}
    </ThemeProvider>
  )
}

export default Shell
