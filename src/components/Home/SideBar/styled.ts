import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  background-color: ${({ theme }) => theme.colors.menuBackground};
  height: 100%;
  max-height: calc(100vh);
  box-sizing: border-box;
  z-index: 99;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`

export const ModalContent = styled.div`
  position: fixed;
  background-color: ${({ theme }) => theme.colors.menuBackground};
  width: max-content;
  min-width: 150px;
  width: 100%;
  max-width: calc(100vw - 52px);
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
