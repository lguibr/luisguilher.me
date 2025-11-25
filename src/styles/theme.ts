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
      shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      shadowGlow: '0 0 20px rgba(102, 126, 234, 0.3), 0 0 40px rgba(118, 75, 162, 0.15)'
    },
    spacing,
    borderRadius,
    transitions,
    breakpoints
  },

  'vs-dark': {
    colors: {
      // Rich, deep backgrounds instead of flat black
      editorBackground: 'linear-gradient(135deg, #0f0c29 0%, #14121f 50%, #0a0a0f 100%)',
      menuBackground: 'rgba(20, 18, 31, 0.95)',
      listDropBackground: 'rgba(30, 27, 43, 0.95)',
      topBarBackground: 'linear-gradient(180deg, rgba(15, 12, 41, 0.98) 0%, rgba(20, 18, 31, 0.95) 100%)',

      // Interactive states with vibrant accents
      sideHighlight: 'rgba(88, 75, 130, 0.3)',
      sideHighlightHover: 'rgba(102, 126, 234, 0.25)',
      tileBorder: 'rgba(102, 126, 234, 0.2)',
      negativeHighlight: 'rgba(15, 12, 41, 0.5)',

      // Vibrant accent colors for dark mode
      accentColor: '#FF6B9D',
      accentSecondary: '#00F5FF',
      accentTertiary: '#C6F6D5',

      // Navigation with subtle gradients
      navigationFile: 'rgba(20, 18, 31, 0.8)',
      selectedNavigationFile: 'linear-gradient(90deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
      fileLine: 'rgba(102, 126, 234, 0.3)',
      queryString: 'rgba(251, 191, 36, 0.3)',

      // Inputs with glass effect
      inputBackground: 'rgba(30, 27, 43, 0.6)',
      selectedBlue: 'rgba(79, 172, 254, 0.3)',

      // Text with better contrast
      text: '#E2E8F0',
      subString: '#94A3B8',
      vsBlue: '#60A5FA',
      white: '#F8FAFC',
      black: '#0F0C29',
      shortCut: 'rgba(30, 27, 43, 0.9)',

      // Glassmorphism for dark mode
      glassBackground: 'rgba(20, 18, 31, 0.7)',
      glassBorder: 'rgba(102, 126, 234, 0.2)',

      // Vibrant gradients for accents
      gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradientSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      gradientAccent: 'linear-gradient(135deg, #00F5FF 0%, #00D9FF 100%)',
      gradientBackground: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',

      // Enhanced shadows for depth
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
      shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
      shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
      shadowGlow: '0 0 20px rgba(102, 126, 234, 0.4), 0 0 40px rgba(118, 75, 162, 0.2)'
    },
    spacing,
    borderRadius,
    transitions,
    breakpoints
  }
}
