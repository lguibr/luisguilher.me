'use client'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic' // Import dynamic
import { FileProvider } from 'src/contexts/FileContext'
import { UIProvider } from 'src/contexts/ThemeContext'
import { PrintProvider } from 'src/contexts/PrintContext'
import Shell from 'src/components/Core/Shell'
import GlobalStyle from 'src/styles/global'
import { SideBarProvider } from 'src/contexts/SideBarContext'
import { FileViewsProvider } from 'src/contexts/FileViewContext'
import { LoadingProvider } from 'src/contexts/LoadingContext'
import { GuideTourProvider } from 'src/contexts/GuideTourContext'
import { AnimationProvider } from 'src/contexts/AnimationContext'
// Remove direct import of AnimationHost
// import AnimationHost from 'src/components/Core/AnimationHost'
import { Analytics } from '@vercel/analytics/react'

// Dynamically import AnimationHost with ssr: false
const AnimationHost = dynamic(
  () => import('src/components/Core/AnimationHost'),
  { ssr: false }
)

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <UIProvider>
        <SideBarProvider>
          <FileProvider>
            <FileViewsProvider initialOpenedFile={'resume/complete-resume.yml'}>
              <PrintProvider>
                {/* Wrap AnimationProvider first so the hook is available */}
                <AnimationProvider>
                  <LoadingProvider>
                    <GuideTourProvider>
                      <Shell>
                        <Component {...pageProps} />
                        {/* Render the dynamically imported AnimationHost */}
                        <AnimationHost />
                        <Analytics />
                      </Shell>
                    </GuideTourProvider>
                  </LoadingProvider>
                </AnimationProvider>
              </PrintProvider>
            </FileViewsProvider>
          </FileProvider>
        </SideBarProvider>
      </UIProvider>
    </>
  )
}
export default MyApp
