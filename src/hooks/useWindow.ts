import { useState, useEffect } from 'react'
import { Theme } from 'src/styles/styled'
import rawTheme from 'src/styles/theme'
import useContextTheme from './useContextTheme'

type WindowSizeType = {
  width?: number
  height?: number
}

type useWindowContext = {
  width?: number
  height?: number
  isXSmall: boolean
  isSmall: boolean
  isMedium: boolean
}

export const useWindowSize = (): useWindowContext => {
  const { selectedTheme } = useContextTheme()
  const theme: Theme = rawTheme[selectedTheme]

  const [windowSize, setWindowSize] = useState<WindowSizeType>({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    function handleResize() {
      if (window !== undefined) {
        // browser code
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const breakpointsEntries = Object.entries(theme.breakpoints).map(
    ([key, value]) => [key, parseInt(value.replace('px', ''))]
  )

  const breakpoints = Object.fromEntries(breakpointsEntries)
  const currentWidth = windowSize?.width || 0
  const isXSmall = currentWidth < breakpoints.xSmall
  const isSmall = currentWidth < breakpoints.small
  const isMedium = currentWidth < breakpoints.medium

  return {
    ...windowSize,
    isXSmall,
    isSmall,
    isMedium
  }
}

export default useWindowSize
