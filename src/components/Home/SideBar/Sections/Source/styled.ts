import styled from 'styled-components'
import Arrow from 'public/icons/arrow.svg'

export const Container = styled.div`
  overflow: auto;
  height: 100%;
  box-sizing: border-box;
`

export const Title = styled.div`
  padding: 4px 8px;
`
export const Ballon = styled.div`
  background-color: transparent;
  padding: 4px 8px;
  border-radius: 0;
`

export const IconContainer = styled.div`
  padding: 4px 8px;
  cursor: pointer;
`

export const RowClickable = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 8px 4px 8px;
`

export const ActionButton = styled.div`
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.menuBackground};
  border: 1px solid ${({ theme }) => theme.colors.tileBorder};
  &:hover {
    background-color: ${({ theme }) => theme.colors.sideHighlightHover};
  }
`

export const ArrowIcon = styled(Arrow)`
  transform: ${({ open }) => !open && 'rotate(-90deg)'};
  fill: ${({ theme }) => theme.colors.text};
  margin: 3px;
`
