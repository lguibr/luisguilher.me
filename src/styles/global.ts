import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`

  * {
    margin : 0px;
    padding : 0px;
    -webkit-tap-highlight-color: transparent;


    ::-webkit-scrollbar {
      width: 8px;
      height: 4px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: #515151;
    }

    ::-webkit-scrollbar-thumb:active {
      background: #662e2a;
    }
  }

  body {
    color: white;
    font: 400 16px sans-serif;
    overflow:hidden;
    min-height: 100vh;
  }
`
