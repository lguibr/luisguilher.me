import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0); /* Fully transparent background */
  cursor: pointer; /* Indicate clicking closes it */
`

export const CanvasContainer = styled.div`
  width: 100%; /* Take full overlay size */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative; /* For potential loading/error messages */
  cursor: pointer; /* Allow clicking the canvas area to close */

  canvas {
    display: block;
    max-width: 100%;
    max-height: 100%;
    /* Removed border-radius and box-shadow */
  }
`

export const StatusMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.colors.white};
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2em;
`
