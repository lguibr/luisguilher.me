'use client'
import type { AppProps } from 'next/app'
// Removed unused dynamic import
import { FileProvider } from 'src/contexts/FileContext'
import { UIProvider } from 'src/contexts/ThemeContext'
import { PrintProvider } from 'src/contexts/PrintContext'
import Shell from 'src/components/Core/Shell'
import GlobalStyle from 'src/styles/global'
import { SideBarProvider } from 'src/contexts/SideBarContext'
import { FileViewsProvider } from 'src/contexts/FileViewContext'
import { LoadingProvider } from 'src/contexts/LoadingContext'
import { GuideTourProvider } from 'src/contexts/GuideTourContext'
import { Analytics } from '@vercel/analytics/react'
import P5Preloader from 'src/components/Core/P5Preloader' // Import the preloader

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <UIProvider>
        <SideBarProvider>
          <FileProvider>
            <FileViewsProvider initialOpenedFile={'resume/complete-resume.yml'}>
              <PrintProvider>
                <LoadingProvider>
                  <GuideTourProvider>
                    <Shell>
                      <P5Preloader /> {/* Add Preloader here */}
                      <Component {...pageProps} />
                      <Analytics />
                    </Shell>
                  </GuideTourProvider>
                </LoadingProvider>
              </PrintProvider>
            </FileViewsProvider>
          </FileProvider>
        </SideBarProvider>
      </UIProvider>
    </>
  )
}
export default MyApp
