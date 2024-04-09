import styled from 'styled-components'

export const Container = styled.div`
  display: none;
  @media print {
    display: block;
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
