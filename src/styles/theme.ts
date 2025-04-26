const breakpoints = {
  xSmall: '480px',
  small: '768px',
  medium: '1024px',
  large: '1280px',
  xLarge: '1600px'
}

export default {
  light: {
    colors: {
      editorBackground: '#FFFFFF',
      text: '#616161',
      menuBackground: '#F3F3F3',
      listDropBackground: '#2C2C2C',
      topBarBackground: '#E5E5E5',
      sideHighlight: '#E8E8E8',
      sideHighlightHover: '#EFFFFF',
      tileBorder: '#EFFFFF',
      negativeHighlight: '#f4f4f4',
      accentColor: '#F44336',
      navigationFile: '#ECECEC',
      selectedNavigationFile: '#FFFFFF',
      fileLine: '#CFCFCF',
      queryString: '#F0C1A3',
      inputBackground: '#FFFFFF',
      selectedBlue: '#CCE9FC',
      subString: '#99999A',
      vsBlue: '#1E88D0',
      white: '#FFFFFF',
      black: '#000000',
      shortCut: '#F3F3F3'
    },
    breakpoints
  },

  'vs-dark': {
    colors: {
      editorBackground: '#0A0A0A',
      menuBackground: '#1A1A1A',
      listDropBackground: '#282828',
      topBarBackground: '#151515',
      text: '#E0E0E0',
      sideHighlight: '#2A2A2A',
      sideHighlightHover: '#171717',
      tileBorder: '#000000',
      negativeHighlight: '#121212',
      accentColor: '#F44336',
      navigationFile: '#1A1A1A',
      selectedNavigationFile: '#0A0A0A',
      fileLine: '#424242',
      queryString: '#66371A',
      inputBackground: '#1F1F1F',
      selectedBlue: '#245779', // your original blue
      subString: '#7F7F7F',
      vsBlue: '#1E88D0', // your original VS Code blue
      white: '#FFFFFF',
      black: '#000000',
      shortCut: '#1A1A1A'
    },
    breakpoints
  }
}
