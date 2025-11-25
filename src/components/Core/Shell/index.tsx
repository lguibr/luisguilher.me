import { ThemeProvider } from 'styled-components'
import { useContextTheme } from 'src/hooks/useContextTheme'
import theme from 'src/styles/theme'
import AmbientBackground from 'src/components/Core/AmbientBackground'

import { useContextPrint } from 'src/hooks/useContextPrint'

const Shell: React.FC = ({ children }) => {
  const { selectedTheme } = useContextTheme()
  const { Printable } = useContextPrint()
  const currentTheme = theme[selectedTheme]
  return (
    <ThemeProvider theme={currentTheme}>
      <AmbientBackground />
      <Printable />
      {children}
    </ThemeProvider>
  )
}

export default Shell
