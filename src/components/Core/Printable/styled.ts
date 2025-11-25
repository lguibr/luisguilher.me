import styled from 'styled-components'

export const Container = styled.div.attrs({ id: 'printable-content' })`
  position: fixed;
  top: -10000px;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  
  @media print {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    overflow: visible;
    display: block;
    z-index: 9999;
    background: white;
  }
`
export const Content = styled.div`
  @media print {
    max-width: 100%;
    display: block;
  }
`
export const Img = styled.img`
  @media print {
    float: left;
    display: block;
    border-radius: 50%;
`
