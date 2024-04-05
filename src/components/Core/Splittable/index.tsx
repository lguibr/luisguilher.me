import { ReactNode } from 'react'
import { StyledPanelGroup, StyledPanel, StyledResizeHandle } from './styled'
import useWindowSize from 'src/hooks/useWindow'

type Direction = 'horizontal' | 'vertical'

interface SplittableContainerProps {
  defaultLayout?: number[]
  direction?: Direction
  firstChild: ReactNode
  secondChild?: ReactNode
  id: number
}

const SplittableContainer: React.FC<SplittableContainerProps> = ({
  direction = 'horizontal',
  firstChild,
  secondChild,
  id
}) => {
  const { isMedium } = useWindowSize()

  return (
    <StyledPanelGroup
      direction={isMedium ? 'vertical' : direction}
      id={`${id}`}
    >
      {firstChild && (
        <StyledPanel order={id + 1} defaultSize={secondChild ? 50 : 100}>
          {firstChild}{' '}
        </StyledPanel>
      )}
      {!isMedium && secondChild && firstChild && (
        <StyledResizeHandle direction={direction} />
      )}
      {secondChild && (
        <StyledPanel order={id + 2} defaultSize={25}>
          {secondChild}
        </StyledPanel>
      )}
    </StyledPanelGroup>
  )
}

export default SplittableContainer
