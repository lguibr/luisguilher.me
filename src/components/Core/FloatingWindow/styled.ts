import styled from 'styled-components'

export const DraggableWindow = styled.div.attrs<{
  x: number
  y: number
  $zIndex: number
  width: number
  height: number
}>(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    zIndex: props.$zIndex,
    width: `${props.width}px`,
    height: `${props.height}px`
  }
}))<{ x: number; y: number; $zIndex: number; width: number; height: number }>`
  position: fixed;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
`
