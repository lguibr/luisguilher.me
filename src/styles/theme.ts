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
      inputBackground: '#FFF',
      selectedBlue: '#CCE9FC',
      subString: '#99999A',
      vsBlue: '#1E88D0',
      white: '#FFF',
      shortCut: '#F3F3F3'
    },
    breakpoints
  },
  'vs-dark': {
    colors: {
      editorBackground: '#1E1E1E',
      menuBackground: '#252526',
      listDropBackground: '#333333',
      topBarBackground: '#323233',
      text: '#CCCCCC',
      sideHighlight: '#37373D',
      sideHighlightHover: '#242d2e',
      tileBorder: '#111111',
      negativeHighlight: '#303131',
      accentColor: '#F44336',
      navigationFile: '#252526',
      selectedNavigationFile: '#1E1E1E',
      fileLine: '#585858',
      queryString: '#66371A',
      inputBackground: '#3C3C3C',
      selectedBlue: '#245779',
      subString: '#99999A',
      vsBlue: '#1E88D0',
      white: '#FFF',
      shortCut: '#2B2B2B'
    },
    breakpoints
  }
}
