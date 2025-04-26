// src/components/Core/AnimationOverlay/styled.ts
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
  background-color: rgba(0, 0, 0, 0); /* Fully transparent background */
  cursor: pointer; /* Indicate clicking closes it */
  z-index: 9999999999; /* Extremely high z-index */
`

export const CanvasContainer = styled.div`
  width: 100%; /* Take full overlay size */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box; /* VERY Important: Padding included inside width/height */
  position: relative;
  cursor: pointer;
  z-index: 9999999999;

  /* --- PADDING RULES START --- */

  /* Always apply top and bottom padding */
  padding-top: 26px;
  padding-bottom: 26px;

  /* Default side padding (can be overridden below) */
  padding-left: 0;
  padding-right: 0;

  /* Apply 54px side padding when screen is wider than 1024px */
  @media (min-width: 1025px) {
    // Use 1025px for "greater than 1024px"
    padding-left: 54px;
    padding-right: 54px;
  }

  /* Apply 54px left padding ONLY when screen is 1024px or narrower */
  @media (max-width: 1024px) {
    padding-left: 54px;
    /* padding-right remains 0 (inherits default) */
  }

  /* --- PADDING RULES END --- */

  canvas {
    display: block;
    /* Canvas max size will be constrained by the container's content box (after padding) */
    max-width: 100%;
    max-height: 100%;
    z-index: 9999999999; /* Ensure canvas is also on top */
  }
`

export const StatusMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) =>
    theme.colors.white}; // Consider using theme.colors.text for adaptability
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2em;
  z-index: 9999999999; /* Ensure message is also on top */
  pointer-events: none; /* Prevent message from blocking clicks on overlay */
`
