import styled from 'styled-components'

export const Container = styled.div`
  display: none;
  @media print {
    padding: 20px;
    display: block;
  }
`
export const Content = styled.div`
  padding: 20px;
`
export const Img = styled.img`
  border-radius: 20px;
  float: left;
  padding: 8px;
`
