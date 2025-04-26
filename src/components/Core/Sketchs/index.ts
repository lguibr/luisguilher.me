import type P5 from 'p5'
import theme from 'src/styles/theme'

// Define Theme type locally or import from styles
type Theme = typeof theme['vs-dark']

// Helper type for sketch factory functions - Keep this type definition
export type SketchFactory = (theme: Theme) => (p5: P5) => void

// Removed the sketchs array export from here
