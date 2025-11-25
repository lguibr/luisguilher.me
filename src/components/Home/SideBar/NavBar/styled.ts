import styled from 'styled-components'

export const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.listDropBackground};
  z-index: 10000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding-bottom: 50px;
  }
`

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

interface OptionProp {
  isSelectedSection: boolean
}

export const Option = styled.div<OptionProp>`
  padding: 10px;
  border-left: ${({ theme, isSelectedSection }) =>
    isSelectedSection && `2px solid  ${theme.colors.accentColor}`};
`
