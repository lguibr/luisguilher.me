import type { AppProps } from 'next/app'
import { FileProvider } from 'src/contexts/FileContext'
import { UIProvider } from 'src/contexts/ThemeContext'
import Shell from 'src/components/Core/Shell'
import GlobalStyle from 'src/styles/global'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <UIProvider>
        <FileProvider>
          <Shell>
            <Component {...pageProps} />
          </Shell>
        </FileProvider>
      </UIProvider>
    </>
  )
}
export default MyApp
