import { createContext, useState } from 'react'

type Loading = boolean

export type LoadingContextType = {
  loading: Loading
  toggleLoading: () => void
  setLoading: (loading: boolean) => void
}

export const LoadingContext = createContext({} as LoadingContextType)

export const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<Loading>(false)

  const toggleLoading = () => {
    setLoading(!loading)
  }

  return (
    <LoadingContext.Provider
      value={{
        loading,
        toggleLoading,
        setLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
