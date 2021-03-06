import styled from 'styled-components'

interface Props {
  isLoading: boolean
}

export const Container = styled.div<Pick<Props, 'isLoading'>>`
  box-sizing: border-box;
  position: absolute;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 999;
  width: 100%;
  height: 100%;
  display: ${({ isLoading }) => (isLoading ? 'flex' : 'none')};
  box-sizing: border-box;
`
