import styled from 'styled-components'

export type HighlightPosition =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'center'
  | null

export const Container = styled.div<{ highlight: HighlightPosition }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #888;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    background-color: rgba(0, 123, 255, 0.2);
    transition: all 0.3s ease;

    ${({ highlight }) => {
      switch (highlight) {
        case 'top':
          return `
            top: 0;
            left: 0%;
            right: 0%;
            height: 25%;
            border-bottom: 2px solid rgba(0, 123, 255, 0.8);
          `
        case 'bottom':
          return `
            bottom: 0;
            left: 0%;
            right: 0%;
            height: 25%;
            border-top: 2px solid rgba(0, 123, 255, 0.8);
          `
        case 'left':
          return `
            top: 0%;
            bottom: 0%;
            left: 0;
            width: 25%;
            border-right: 2px solid rgba(0, 123, 255, 0.8);
          `
        case 'right':
          return `
            top: 0%;
            bottom: 0%;
            right: 0;
            width: 25%;
            border-left: 2px solid rgba(0, 123, 255, 0.8);
          `
        case 'center':
          return `
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 123, 255, 0.5);
            border: 2px solid rgba(0, 123, 255, 0.8);
          `
        default:
          return `display: none;`
      }
    }}
  }

  &:hover {
    border-color: #888;
  }
`
