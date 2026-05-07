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
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ChatProvider } from 'src/contexts/ChatContext'
import { L0g1nProvider } from 'l0g1n-sdk'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy...",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <L0g1nProvider firebaseConfig={firebaseConfig} env="PROD">
        <UIProvider>
          <SideBarProvider>
            <FileProvider>
              <FileViewsProvider
                initialOpenedFile={[
                  'repositories/lguibr/README.md',
                  'CURRICULUM.md',
                  'README.md'
                ]}
              >
                <ChatProvider>
                  <PrintProvider>
                    <LoadingProvider>
                      <GuideTourProvider>
                        <Shell>
                          <P5Preloader /> {/* Add Preloader here */}
                          <Component {...pageProps} />
                          <SpeedInsights />
                          <Analytics />
                        </Shell>
                      </GuideTourProvider>
                    </LoadingProvider>
                  </PrintProvider>
                </ChatProvider>
              </FileViewsProvider>
            </FileProvider>
          </SideBarProvider>
        </UIProvider>
      </L0g1nProvider>
    </>
  )
}
export default MyApp
