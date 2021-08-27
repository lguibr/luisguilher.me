import styled from 'styled-components'
import Arrow from 'public/icons/arrow.svg'
import TextComponent from '../Text'

export const Span = styled(TextComponent)``
export const Container = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content max-content;
  grid-gap: 5px;
  padding: 1px;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;
`
export const ArrowContainer = styled.div``

export const ArrowIcon = styled(Arrow)`
  transform: ${({ open }) => !open && 'rotate(-90deg)'};
  fill: ${({ theme }) => theme.colors.text};
`
