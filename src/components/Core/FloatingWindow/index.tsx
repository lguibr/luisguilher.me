import { useState, useCallback, useEffect } from 'react'
import { DraggableWindow } from './styled'

interface FloatingWindowProps {
  zIndex?: number
  children: React.ReactNode
  x?: number
  y?: number
  width?: number
  height?: number
}

interface Position {
  x: number
  y: number
}

const AppBarHeight = 75 // Define the height of the AppBar

const FloatingWindow: React.FC<FloatingWindowProps> = ({
  zIndex = 999,
  children,
  x = 0,
  y = AppBarHeight, // Set initial y to AppBarHeight to start below the AppBar
  width = 200,
  height = 200
}) => {
  if (typeof window === 'undefined') return null
  const constrainPosition = useCallback(
    (x: number, y: number) => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const constrainedX = Math.min(Math.max(0, x), viewportWidth - width)
      const constrainedY = Math.min(
        Math.max(AppBarHeight, y),
        viewportHeight - height
      ) // Prevent y from being less than AppBarHeight
      return { x: constrainedX, y: constrainedY }
    },
    [width, height]
  )

  const [dragging, setDragging] = useState<boolean>(false)
  const [position, setPosition] = useState<Position>(() =>
    constrainPosition(x, y)
  )
  const [relPosition, setRelPosition] = useState<Position>({ x: 0, y: 0 })

  const onStart = useCallback(
    (clientX: number, clientY: number) => {
      setDragging(true)
      setRelPosition({
        x: clientX - position.x,
        y: clientY - position.y
      })
    },
    [position]
  )

  const onEnd = useCallback(() => {
    setDragging(false)
  }, [])

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      if (dragging) {
        const newX = clientX - relPosition.x
        const newY = clientY - relPosition.y
        const constrainedPosition = constrainPosition(newX, newY)
        setPosition(constrainedPosition)
      }
    },
    [dragging, relPosition, constrainPosition]
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) =>
      onMove(e.touches[0].clientX, e.touches[0].clientY)
    const handleResize = () => {
      const updatedPosition = constrainPosition(position.x, position.y)
      setPosition(updatedPosition)
    }

    window.addEventListener('resize', handleResize)
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('mouseup', onEnd)
      window.addEventListener('touchend', onEnd)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchend', onEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('resize', handleResize)
    }
  }, [dragging, onMove, onEnd, constrainPosition, position])

  return (
    <DraggableWindow
      x={position.x}
      y={position.y}
      $zIndex={zIndex}
      width={width}
      height={height}
      onMouseDown={e => onStart(e.clientX, e.clientY)}
      onTouchStart={e => {
        e.preventDefault() // Prevents mobile scrolling when dragging
        onStart(e.touches[0].clientX, e.touches[0].clientY)
      }}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </DraggableWindow>
  )
}

export default FloatingWindow
