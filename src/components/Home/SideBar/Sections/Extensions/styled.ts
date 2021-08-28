import styled from 'styled-components'

export const Container = styled.div`
  padding: 8px;
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-gap: 20px;
  justify-content: end;
  box-sizing: border-box;
  cursor: pointer;
  max-width: 100%;
  :hover {
    background-color: ${({ theme }) => theme.colors.sideHighlight};
  }
`
