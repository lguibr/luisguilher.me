import styled from 'styled-components'
import Text from 'src/components/Core/Text'

export const Highlight = styled(Text)`
  background-color: ${({ theme }) => theme.colors.queryString};
`

export const Span = styled(Text)`
  white-space: nowrap;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: sans-serif;
`
