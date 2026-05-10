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
  max-height: 100dvh;
  height: 100dvh;
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

export const StyledResizeHandle = styled(PanelResizeHandle)<{
  $isVertical?: boolean
}>`
  width: ${({ $isVertical }) => ($isVertical ? '100%' : '2px')};
  height: ${({ $isVertical }) => ($isVertical ? '2px' : '100%')};
  background-color: transparent;
  transition: background-color 0.2s;
  cursor: ${({ $isVertical }) => ($isVertical ? 'row-resize' : 'col-resize')};
  z-index: 10;

  &:hover,
  &[data-resize-handle-active] {
    background-color: ${({ theme }) => theme.colors.accentColor || '#007fd4'};
  }
`
