import styled from 'styled-components'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

type Direction = 'horizontal' | 'vertical'

export const StyledPanelGroup = styled(PanelGroup)<{ direction: Direction }>`
  width: 100%;
  max-width: 100%;
  height: 400px;
  overflow: hidden;

  ${({ direction }) =>
    direction === 'vertical' &&
    `
    flex-direction: column;
  `}
`

export const StyledPanel = styled(Panel)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #888;
  min-width: 300px;
`

export const StyledResizeHandle = styled(PanelResizeHandle)<{
  direction: Direction
}>`
  background-color: #aaa;
  z-index: 10;
  cursor: ${({ direction }) =>
    direction === 'horizontal' ? 'col-resize' : 'row-resize'};
  width: ${({ direction }) => (direction === 'horizontal' ? '1px' : '100%')};
  height: ${({ direction }) => (direction === 'horizontal' ? '100%' : '1px')};
  opacity: 0.2;
`
