import styled from 'styled-components'

export const Container = styled.div`
  border: 2px none/ green;
  max-height: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`
export const Canvas = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 2px none/ red;
  min-height: 100px;

  @keyframes border {
    from {
      border-bottom: 2px solid transparent;
    }
    50% {
      border-bottom: 2px solid transparent;
    }
    to {
      border-bottom: 2px solid ${({ theme }) => theme.colors.text};
    }
  }
  border-bottom: 2px solid ${({ theme }) => theme.colors.text};

  animation: border 2s ease-in;
`
