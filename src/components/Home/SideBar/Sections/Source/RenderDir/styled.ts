import styled from 'styled-components'

interface FileProps {
  isHighLighted?: boolean
  embedded: number
}
interface ChildrenProps {
  opened: boolean
  embedded: number
}
interface ContainerProps {
  embedded: number
  isHighLighted: boolean
}

export const Container = styled.div<ContainerProps>`
  background-color: ${({ isHighLighted, theme }) =>
    isHighLighted && theme.colors.sideHighlight};
  :hover {
    background-color: ${({ isHighLighted, theme }) =>
      isHighLighted
        ? theme.colors.sideHighlight
        : theme.colors.sideHighlightHover};
  }
`

export const RealContainer = styled.div<FileProps>`
  position: relative;
  cursor: pointer;
  :hover {
    :before {
      content: ' ';
      left: ${({ embedded }) => `${embedded * 8 + 4}px`};
      position: absolute;
      height: 100%;
      border-left: ${({ embedded, theme }) =>
        embedded && `1px solid ${theme.colors.fileLine}`};
      z-index: 9999;
    }
  }
`

export const File = styled.div<FileProps>`
  padding-left: ${({ embedded }) => embedded && `${embedded * 8}px`};
`

export const Children = styled.div<ChildrenProps>`
  display: ${({ opened }) => (opened ? 'grid' : 'none')};
  background-color: ${({ theme }) => theme.colors.menuBackground};
`
