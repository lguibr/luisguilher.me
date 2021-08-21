import styled from 'styled-components'

interface Props {
  isCurrent: boolean
}

export const Container = styled.div`
  border: 2px none/ yellow;
  display: flex;
  max-width: 100%;
  overflow-x: auto;
`
export const Row = styled.div<Pick<Props, 'isCurrent'>>`
  cursor: pointer;
  border: 5px none/ orange;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 10px;
  padding: 5px;
  padding-right: 8px;
  background-color: ${({ isCurrent, theme }) =>
    isCurrent
      ? theme.colors.selectedNavigationFile
      : theme.colors.navigationFile};
  border-right: 1px solid ${({ theme }) => theme.colors.tileBorder};
  border-bottom: ${({ isCurrent, theme }) =>
    isCurrent ? `1px solid ${theme.colors.accentColor}` : 'none'};
  div :last-child {
    display: none;
  }

  :hover {
    background-color: ${({ theme }) => theme.colors.selectedNavigationFile};
    div :last-child {
      display: grid;
    }
  }
`
export const Close = styled.div`
  display: grid;
  place-items: center;

  cursor: pointer;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  :hover {
    background-color: ${({ theme }) => theme.colors.negativeHighlight};
  }
  svg {
    fill: ${({ theme }) => theme.colors.text};
    height: 8px;
    width: 8px;
  }
`
