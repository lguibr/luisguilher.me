import styled from 'styled-components'

interface Props {
  isLoading: boolean
}

// This container might just be for positioning or a background if needed,
// as the actual animation is handled by the global AnimationHost.
// If Loading component becomes purely logical (triggering context), this might be removed.
export const Container = styled.div<Pick<Props, 'isLoading'>>`
  /* display: ${({ isLoading }) => (isLoading ? 'block' : 'none')}; */
  /* Remove positioning/sizing if AnimationHost handles it globally */
  /* Keep if you want a specific background behind the global animation */
`
