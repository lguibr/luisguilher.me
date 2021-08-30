import styled from 'styled-components'

export const Container = styled.div`
  max-width: 100%;
  height: 100%;
`

export const Body = styled.div`
  box-sizing: border-box;
  max-width: 100%;
  text-align: center;
`
export const Header = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 10px;
  align-content: center;
  text-align: center;
  padding: 6px;
  padding-bottom: 16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.xSmall}) {
    grid-template-columns: 1fr;
    grid-template-rows: max-content max-content;
  }
`
