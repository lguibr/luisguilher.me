import styled from 'styled-components'
import Arrow from 'public/icons/arrow.svg'

export const Container = styled.div`
  cursor: pointer;
  max-width: 100%;
`
export const Match = styled.div`
  padding: 3px;
  padding-left: 20px;
  box-sizing: border-box;
  :hover {
    background-color: ${({ theme }) => theme.colors.sideHighlightHover};
  }
`
export const MatchBody = styled.div``
export const MatchHeader = styled.div`
  display: flex;
  box-sizing: border-box;
  pre {
    font-family: sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  svg {
    width: 10px;
    height: 10px;
  }
  :hover {
    background-color: ${({ theme }) => theme.colors.sideHighlightHover};
  }
`

export const ArrowIcon = styled(Arrow)`
  transform: ${({ open }) => !open && 'rotate(-90deg)'};
  fill: ${({ theme }) => theme.colors.text};
`
