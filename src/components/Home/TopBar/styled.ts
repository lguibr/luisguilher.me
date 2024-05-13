import styled from 'styled-components'

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.topBarBackground};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  z-index: 9999;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`
