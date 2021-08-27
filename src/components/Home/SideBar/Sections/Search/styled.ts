import styled from 'styled-components'

export const Container = styled.div`
  padding: 6px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 100%;
  padding-bottom: 36px;
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

export const Title = styled.div`
  padding: 4px 0px;
`

export const Form = styled.div`
  display: grid;
  grid-gap: 1em;
  padding: 8px;
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
