import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 10;
  padding: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
    background: ${({ theme }) => theme.colors.sideHighlight};
    border-color: ${({ theme }) => theme.colors.fileLine};
  }
`
