import type { AppProps } from 'next/app'
import { FileProvider } from 'src/contexts/FileContext'
import { UIProvider } from 'src/contexts/ThemeContext'
import { PrintProvider } from 'src/contexts/PrintContext'
import Shell from 'src/components/Core/Shell'
import GlobalStyle from 'src/styles/global'
import { SideBarProvider } from 'src/contexts/SideBarContext'
import { FileViewsProvider } from 'src/contexts/FileViewContext'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <UIProvider>
        <SideBarProvider>
          <FileProvider>
            <FileViewsProvider initialOpenedFile={'resume/complete-resume.yml'}>
              <PrintProvider>
                <Shell>
                  <Component {...pageProps} />
                </Shell>
              </PrintProvider>
            </FileViewsProvider>
          </FileProvider>
        </SideBarProvider>
      </UIProvider>
    </>
  )
}
export default MyApp
