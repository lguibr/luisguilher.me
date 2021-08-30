import { useContextGuideTour } from 'src/hooks/useGuideTour'
import { TourComponent } from './styled'
import { useTheme } from 'styled-components'

const GuideTour: React.FC = () => {
  const { steps, setTour, isTourOpen } = useContextGuideTour()
  const theme = useTheme()

  return isTourOpen ? (
    <TourComponent
      steps={steps}
      className="guide"
      isOpen={isTourOpen}
      rounded={10}
      accentColor={theme.colors.accentColor}
      onRequestClose={() => setTour(false)}
    />
  ) : (
    <></>
  )
}

export default GuideTour
