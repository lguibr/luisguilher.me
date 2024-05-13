import styled from 'styled-components'

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.vsBlue};
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  height: 1.5rem;
  z-index: 999;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
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
