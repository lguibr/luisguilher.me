import styled from 'styled-components'

export const Content = styled.div`
  display: flex;
  height: 100%;
  box-sizing: border-box;
`
export const Container = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-rows: min-content 1fr;
  background: ${({ theme }) => theme.colors.editorBackground};
  max-height: 100vh;
  height: 100vh;
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
