import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin : 0px;
    padding : 0px;
  }

  body {
    background: ${({ theme }) => theme.colors.background};
    color: white;
    font: 400 16px "Roboto Mono";
  }
`
