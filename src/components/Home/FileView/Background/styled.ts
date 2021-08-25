import styled from 'styled-components'
import Image from 'next/image'
import Text from 'src/components/Core/Text'

export const Img = styled(Image)`
  box-shadow: 3px 3px red, -1em 0 0.4em olive;
`

export const SpanHighlighted = styled(Text)`
  background-color: ${({ theme }) => theme.colors.shortCut};
  border-radius: 2px;
  padding: 2px 6px;
  margin: 0px 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25), 0 2px 2px rgba(0, 0, 0, 0.22);
`

export const Container = styled.div`
  display: grid;
  grid-gap: 50px;
  grid-template-rows: max-content max-content;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
`

export const Content = styled.div`
  display: grid;
  grid-gap: 12px;
`

export const VS = styled.div`
  background: url(/profile.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 280px;
  width: 280px;
  clip-path: polygon(
    9% 76%,
    0 67%,
    16% 50%,
    0 34%,
    9% 24%,
    15% 27%,
    29% 38%,
    71% 1%,
    83% 4%,
    98% 12%,
    100% 87%,
    76% 99%,
    70% 99%,
    29% 62%
  );
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    height: 120px;
    width: 120px;
  }
`
