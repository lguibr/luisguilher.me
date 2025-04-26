import { useEffect } from 'react'

const P5Preloader: React.FC = () => {
  useEffect(() => {
    let isMounted = true
    console.log(
      '[P5Preloader] Component mounted. Attempting to preload P5.js...'
    )

    import('p5')
      .then(p5Module => {
        if (isMounted) {
          console.log(
            '[P5Preloader] P5.js module successfully preloaded:',
            p5Module ? 'OK' : 'Module Empty?'
          )
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error('[P5Preloader] Error preloading P5.js:', error)
        }
      })

    return () => {
      isMounted = false
      console.log('[P5Preloader] Component unmounted.')
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  // This component renders nothing visible
  return null
}

export default P5Preloader
