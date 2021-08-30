import type { NextPage } from 'next'

import { LoadingProvider } from 'src/contexts/LoadingContext'
import { GuideTourProvider } from 'src/contexts/GuideTourContext'

import HomeView from 'src/components/Home'
const Home: NextPage = () => {
  return (
    <LoadingProvider>
      <GuideTourProvider>
        <title>Luís Guilherme</title>
        <meta name="description" content="Luis Guilherme Webpage" />
        <div>
          <HomeView />
        </div>
      </GuideTourProvider>
    </LoadingProvider>
  )
}

export default Home
