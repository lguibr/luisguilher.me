import type { NextPage } from 'next'

import { LoadingProvider } from 'src/contexts/LoadingContext'
// import Fonts from 'src/components/Core/Fonts'
import HomeView from 'src/components/Home'
const Home: NextPage = () => {
  return (
    <LoadingProvider>
      <title>Luís Guilherme</title>
      <meta name="description" content="Luis Guilherme Webpage" />
      <div>
        <HomeView />
      </div>
    </LoadingProvider>
  )
}

export default Home
