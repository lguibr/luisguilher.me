import styled from 'styled-components'

export const Input = styled.input`
  background-color: transparent;
  border-width: 0px;
  border: none;
  outline: 0;
  color: ${({ theme }) => theme.colors.text};
  font: 400 16px sans-serif;
`
