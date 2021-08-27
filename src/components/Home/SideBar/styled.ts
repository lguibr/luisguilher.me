import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  background-color: ${({ theme }) => theme.colors.menuBackground};
  height: 100%;
  max-height: calc(100vh);
  box-sizing: border-box;
  z-index: 99;
`

export const ModalContent = styled.div`
  position: fixed;
  background-color: ${({ theme }) => theme.colors.menuBackground};
  width: max-content;
  min-width: 150px;
  width: 100%;
  max-width: calc(100vw - 52px);
  border: 2px dotted red;
  left: 52px;
  box-sizing: border-box;
  overflow: hidden;
  height: calc(100%);
  padding-bottom: 36px;
`

export const Main = styled.div`
  height: calc(100% - 10px);
  box-sizing: border-box;
  resize: horizontal;
  overflow: hidden;
  width: 300px;
  min-width: 300px;
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
