import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  background-color: ${({ theme }) => theme.colors.menuBackground};
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  border: 10px none/ green;
  z-index: 999;
`

export const ModalContent = styled.div`
  position: fixed;
  background-color: ${({ theme }) => theme.colors.menuBackground};
  width: max-content;
  min-width: 200px;
  left: 52px;
  height: 100%;
  overflow: hidden;
`

export const Main = styled.div`
  border: 5px none/ green;
  height: 100%;
  box-sizing: border-box;
  resize: horizontal;
  overflow: hidden;
  min-width: 200px;
  position: relative;

  background-color: ${({ theme }) => theme.colors.menuBackground};

  ::after {
    content: ' ';
    position: absolute;
    bottom: 5px;
    right: 5px;
    height: 16px;
    width: 16px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('/icons/arrow-both.svg');
  }
`
