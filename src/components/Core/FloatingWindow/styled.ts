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
})) <{ x: number; y: number; $zIndex: number; width: number; height: number }>`
  position: fixed;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Glassmorphism Effect */
  background: rgba(20, 18, 31, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(102, 126, 234, 0.1);
  
  /* Smooth transitions */
  transition: box-shadow 0.3s ease, transform 0.1s ease;
  
  &:hover {
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.6),
                0 0 20px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    cursor: grabbing;
    transform: scale(0.99);
  }
`

