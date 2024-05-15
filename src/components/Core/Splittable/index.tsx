import { ReactNode } from 'react'
import { StyledPanelGroup, StyledPanel, StyledResizeHandle } from './styled'
import useWindowSize from 'src/hooks/useWindow'

type Direction = 'horizontal' | 'vertical'

interface SplittableContainerProps {
  defaultLayout?: number[]
  direction?: Direction
  targetView: ReactNode
  newView?: ReactNode
  id: number
}

const SplittableContainer: React.FC<SplittableContainerProps> = ({
  direction = 'horizontal',
  targetView,
  newView,
  id
}) => {
  const { isMedium } = useWindowSize()

  return (
    <StyledPanelGroup
      direction={isMedium ? 'vertical' : direction}
      id={`${id}`}
    >
      {newView && (
        <StyledPanel order={id + 1} defaultSize={25}>
          {newView}
        </StyledPanel>
      )}

      {!isMedium && newView && targetView && (
        <StyledResizeHandle direction={direction} />
      )}
      {targetView && (
        <StyledPanel order={id + 2} defaultSize={newView ? 50 : 100}>
          {targetView}
        </StyledPanel>
      )}
    </StyledPanelGroup>
  )
}

export default SplittableContainer
