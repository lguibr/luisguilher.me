import styled from 'styled-components'
import Text from 'src/components/Core/Text'
import Arrow from 'public/icons/arrow.svg'

export const Highlight = styled(Text)`
  background-color: ${({ theme }) => theme.colors.queryString};
`
export const FileMatch = styled.div`
  cursor: pointer;
`
export const Match = styled.div`
  padding: 3px;
  padding-left: 20px;
  :hover {
    background-color: ${({ theme }) => theme.colors.sideHighlightHover};
  }
`
export const MatchBody = styled.div`
  padding: 0px 8px;
`
export const MatchHeader = styled.div`
  padding: 0px 8px;
  display: flex;
  box-sizing: border-box;
  svg {
    width: 10px;
    height: 10px;
  }
  :hover {
    background-color: ${({ theme }) => theme.colors.sideHighlightHover};
  }
`
export const Container = styled.div`
  margin: 8px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const InputContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.inputBackground};
  display: grid;
  grid-template-columns: 1fr max-content;
  padding: 3px;
  max-width: 100%;
  input {
    min-width: 0px;
  }
`
export const ArrowIcon = styled(Arrow)`
  transform: ${({ open }) => !open && 'rotate(-90deg)'};
  fill: ${({ theme }) => theme.colors.text};
`

export const Title = styled.div`
  padding: 4px 0px;
`

export const Form = styled.div`
  display: grid;
  grid-gap: 1em;
`

interface PropsCaseSensitiveContainer {
  caseInsensitive?: boolean
}

export const CaseSensitiveContainer = styled.div<PropsCaseSensitiveContainer>`
  cursor: pointer;
  background-color: ${({ theme, caseInsensitive }) =>
    !caseInsensitive
      ? theme.colors.inputBackground
      : theme.colors.selectedBlue};
  display: flex;
  padding: 3px;
`
