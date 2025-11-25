import styled from 'styled-components'

interface PropsContainer {
  open?: boolean
}

export const Container = styled.div<PropsContainer>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  animation: ${({ open }) => (open ? 'fadeIn 0.3s ease-out' : 'none')};
`

export const Background = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(15, 12, 41, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
`
