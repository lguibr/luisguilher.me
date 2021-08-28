import { createContext, useState } from 'react'

type Loading = boolean

export type LoadingContextType = {
  loading: Loading
  flashLoading: (time?: number, index?: number | undefined) => void
  setLoading: (loading: boolean) => void
  index?: number | undefined
}

export const LoadingContext = createContext({} as LoadingContextType)

export const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<Loading>(false)
  const [index, setIndex] = useState<number | undefined>(undefined)

  const flashLoading = (time = 3500, index: number | undefined) => {
    setIndex(index)
    setLoading(true)
    setTimeout(() => {
      setIndex(undefined)
      setLoading(false)
    }, time)
  }

  return (
    <LoadingContext.Provider
      value={{
        loading,
        index,
        flashLoading,
        setLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
