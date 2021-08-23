/* eslint @typescript-eslint/no-empty-interface: "off" */
import 'styled-components'
import theme from 'src/styles/theme'

export type Theme = typeof theme['vs-dark']

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
