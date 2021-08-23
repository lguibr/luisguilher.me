import styled from 'styled-components'

export const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.listDropBackground};
  border: 2px none/ green;
  z-index: 999;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding-bottom: 50px;
  }
`

export const Section = styled.div`
  border: 2px none/ pink;
  width: 100%;
  display: flex;
  flex-direction: column;
`

interface OptionProp {
  isSelectedSection: boolean
}

export const Option = styled.div<OptionProp>`
  border: 2px none/ red;
  padding: 10px;
  border-left: ${({ theme, isSelectedSection }) =>
    isSelectedSection && `2px solid  ${theme.colors.accentColor}`};
`
