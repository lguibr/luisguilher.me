const breakpoints = {
  xSmall: '480px',
  small: '768px',
  medium: '1024px',
  large: '1280px',
  xLarge: '1600px'
}

// Modern spacing scale
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
}

// Border radius scale
const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  round: '50%'
}

// Transition timing
const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)'
}

export default {
  light: {
    colors: {
      // Base colors with more warmth
      editorBackground: '#FAFAFA',
      text: '#2D3748',
      menuBackground: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
      listDropBackground: '#FFFFFF',
      topBarBackground: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)',

      // Interactive states
      sideHighlight: '#E2E8F0',
      sideHighlightHover: '#CBD5E0',
      tileBorder: '#E2E8F0',
      negativeHighlight: '#F7FAFC',

      // Accent colors - vibrant but professional
      accentColor: '#EF4444',
      accentSecondary: '#3B82F6',
      accentTertiary: '#10B981',

      // Navigation
      navigationFile: '#F7FAFC',
      selectedNavigationFile: '#FFFFFF',
      fileLine: '#CBD5E0',
      queryString: '#FED7AA',

      // Inputs
      inputBackground: '#FFFFFF',
      selectedBlue: '#DBEAFE',

      // Text variations
      subString: '#718096',
      vsBlue: '#2563EB',
      white: '#FFFFFF',
      black: '#1A202C',
      shortCut: '#F7FAFC',

      // Glassmorphism
      glassBackground: 'rgba(255, 255, 255, 0.7)',
      glassBorder: 'rgba(255, 255, 255, 0.18)',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradientSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      gradientAccent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      gradientBackground: 'linear-gradient(135deg, #FAFAFA 0%, #EDF2F7 100%)',

      // Shadows for elevation
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      shadowMd:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      shadowLg:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      shadowXl:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      shadowGlow:
        '0 0 20px rgba(102, 126, 234, 0.3), 0 0 40px rgba(118, 75, 162, 0.15)'
    },
    spacing,
    borderRadius,
    transitions,
    breakpoints
  },

  'vs-dark': {
    colors: {
      // Classic VS Code neutral backgrounds
      editorBackground: '#1e1e1e',
      menuBackground: '#252526',
      listDropBackground: '#2d2d30',
      topBarBackground: '#333333',

      // Interactive states with clean accents
      sideHighlight: '#2a2d2e',
      sideHighlightHover: '#37373d',
      tileBorder: '#3c3c3c',
      negativeHighlight: '#1e1e1e',

      // Primary accent colors (VS Code Blue)
      accentColor: '#007acc',
      accentSecondary: '#005a9e',
      accentTertiary: '#0098ff',

      // Navigation
      navigationFile: '#252526',
      selectedNavigationFile: '#37373d',
      fileLine: '#3c3c3c',
      queryString: '#d7ba7d',

      // Inputs
      inputBackground: '#3c3c3c',
      selectedBlue: 'rgba(0, 122, 204, 0.3)',

      // Text with sharp contrast
      text: '#cccccc',
      subString: '#858585',
      vsBlue: '#4fc1ff',
      white: '#ffffff',
      black: '#000000',
      shortCut: '#858585',

      // Glassmorphism - disabled in brutalist IDE
      glassBackground: 'transparent',
      glassBorder: 'transparent',

      // Clean gradients for accents
      gradientPrimary: '#007acc',
      gradientSecondary: '#005a9e',
      gradientAccent: '#007acc',
      gradientBackground: '#1e1e1e',

      // Shadows removed for flatness
      shadowSm: 'none',
      shadowMd: 'none',
      shadowLg: 'none',
      shadowXl: 'none',
      shadowGlow: 'none'
    },
    spacing,
    borderRadius: {
      sm: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      round: '0px'
    },
    transitions,
    breakpoints
  }
}
