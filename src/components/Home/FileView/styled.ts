import styled from 'styled-components'

interface Props {
  currentFile: boolean
}

export const LoadingContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`

export const Container = styled.div`
  position: relative;
  height: 100%;
  max-height: 100%;
  width: 100%;
  box-sizing: border-box;
`

export const EditorContainer = styled.div<Pick<Props, 'currentFile'>>`
  display: ${({ currentFile }) => (currentFile ? 'flex' : 'none')};
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`
