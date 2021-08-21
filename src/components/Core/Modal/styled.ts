import styled from 'styled-components'

interface PropsContainer {
  open?: boolean
}

export const Container = styled.div<PropsContainer>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  border: 2px none/ red;
`

export const Background = styled.div`
  border: 2px none/ blue;
  position: relative;
  width: 100%;
  height: 100%;
`
