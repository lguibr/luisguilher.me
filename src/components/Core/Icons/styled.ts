import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);

    img {
      filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.5));
    }
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    transition: filter 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
`
