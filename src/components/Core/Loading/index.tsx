import useContextLoading from 'src/hooks/useLoading'
import AnimationOverlay from 'src/components/Core/AnimationOverlay'

const Loading: React.FC = () => {
  const { loading, setLoading, currentSketch } = useContextLoading()

  // Render AnimationOverlay only if loading is true AND a sketch is selected
  return (
    <>
      {loading && currentSketch && (
        <AnimationOverlay
          sketchName={currentSketch}
          onClose={() => setLoading(false)} // Clicking overlay stops loading
        />
      )}
    </>
  )
}

export default Loading
