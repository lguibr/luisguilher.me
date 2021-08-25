import styled from 'styled-components'
import Text from 'src/components/Core/Text'

export const TextComponent = styled(Text)`
  padding: 0px 20px;
`

export const Container = styled.div`
  position: relative;
`

export const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 999;
`
export const Content = styled.div`
  background: ${({ theme }) => theme.colors.menuBackground};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  position: absolute;
  bottom: 0;
  left: 100%;
  z-index: 999;
  border-radius: 2px;
`

export const OptionContainer = styled.div`
  padding: 0px 5px;
  :hover {
    background-color: ${({ theme }) => theme.colors.selectedBlue};
  }
  div {
    border-bottom: 1px solid ${({ theme }) => theme.colors.fileLine};
  }
  :last-child {
    div {
      border-bottom: none;
    }
  }
`

export const Option = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  min-width: max-content;
  width: 100%;
  padding: 5px 0px;
`
