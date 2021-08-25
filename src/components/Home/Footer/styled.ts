import styled from 'styled-components'

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.vsBlue};
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  height: 20px;
`

export const Info = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-gap: 5px;

  justify-content: center;
  align-items: center;
`

export const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-gap: 20px;
  svg {
    height: 12px;
    width: 12px;
  }
`
