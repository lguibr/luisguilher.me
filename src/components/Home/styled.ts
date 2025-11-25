import styled from 'styled-components'

export const Content = styled.div`
  display: flex;
  height: 100%;
  box-sizing: border-box;
  grid-template-rows: 22px 1fr 1.5rem;
  overflow: hidden;
`
export const Container = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-rows: 30px 1fr 1.5rem;
  background: ${({ theme }) => theme.colors.editorBackground};
  max-height: 100vh;
  height: 100vh;
  overflow: hidden;
  @media print {
    display: none;
  }
`

export const FileContainer = styled.div`
  position: relative;
`

export const Main = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr;
  width: 100%;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
`
