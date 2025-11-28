import styled from 'styled-components'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

export const Content = styled.div`
  display: flex;
  height: 100%;
  box-sizing: border-box;
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
  height: 100%;
  overflow: hidden;
`

export const Main = styled.div`
  display: grid;
  grid-template-rows: max-content minmax(0, 1fr);
  width: 100%;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
`

export const StyledPanelGroup = styled(PanelGroup)`
  height: 100%;
  width: 100%;
`

export const StyledPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export const StyledResizeHandle = styled(PanelResizeHandle)`
  width: 2px;
  background-color: transparent;
  transition: background-color 0.2s;
  cursor: col-resize;
  z-index: 10;

  &:hover,
  &[data-resize-handle-active] {
    background-color: ${({ theme }) => theme.colors.accentColor || '#007fd4'};
  }
`
