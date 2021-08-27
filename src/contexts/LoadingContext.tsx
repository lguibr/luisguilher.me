import { createContext, useState } from 'react'

type Loading = boolean

export type LoadingContextType = {
  loading: Loading
  flashLoading: (time?: number) => void
  setLoading: (loading: boolean) => void
}

export const LoadingContext = createContext({} as LoadingContextType)

export const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<Loading>(false)

  const flashLoading = (time = 3500) => {
    setLoading(true)
    setTimeout(() => setLoading(false), time)
  }

  return (
    <LoadingContext.Provider
      value={{
        loading,
        flashLoading,
        setLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
