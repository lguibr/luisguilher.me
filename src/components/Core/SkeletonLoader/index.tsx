import styled from 'styled-components'
import { animations } from 'src/styles/animations'

const SkeletonContainer = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  height: ${({ height }) => height || '16px'};
  width: ${({ width }) => width || '100%'};
  border-radius: 4px;
  ${animations.shimmer}
`

const SkeletonLoader: React.FC = () => {
  return (
    <SkeletonContainer>
      <SkeletonLine width="60%" height="24px" />
      <SkeletonLine width="40%" />
      <SkeletonLine width="90%" />
      <SkeletonLine width="80%" />
      <SkeletonLine width="95%" />
      <SkeletonLine width="70%" />
      <div style={{ marginTop: '20px' }}>
        <SkeletonLine width="50%" height="20px" />
        <SkeletonLine width="85%" />
        <SkeletonLine width="75%" />
        <SkeletonLine width="90%" />
      </div>
    </SkeletonContainer>
  )
}

export default SkeletonLoader
