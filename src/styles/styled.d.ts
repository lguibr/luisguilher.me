/* eslint @typescript-eslint/no-empty-interface: "off" */
import 'styled-components'
import theme from 'src/styles/theme'

export type Theme = typeof theme['vs-dark']

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      editorBackground: string
      menuBackground: string
      listDropBackground: string
      topBarBackground: string
      sideHighlight: string
      sideHighlightHover: string
      tileBorder: string
      negativeHighlight: string
      accentColor: string
      accentSecondary: string
      accentTertiary: string
      navigationFile: string
      selectedNavigationFile: string
      fileLine: string
      queryString: string
      inputBackground: string
      selectedBlue: string
      text: string
      subString: string
      vsBlue: string
      white: string
      black: string
      shortCut: string
      glassBackground: string
      glassBorder: string
      gradientPrimary: string
      gradientSecondary: string
      gradientAccent: string
      gradientBackground?: string
      shadowSm: string
      shadowMd: string
      shadowLg: string
      shadowXl: string
      shadowGlow?: string
    }
    breakpoints: {
      xSmall: string
      small: string
      medium: string
      large: string
      xLarge: string
    }
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      xxl: string
    }
    borderRadius: {
      sm: string
      md: string
      lg: string
      xl: string
      round: string
    }
    transitions: {
      fast: string
      normal: string
      slow: string
    }
  }
}
