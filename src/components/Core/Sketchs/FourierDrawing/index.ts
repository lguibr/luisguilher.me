// src/components/Core/Sketchs/FourierDrawing/index.ts
import type P5 from 'p5'
import type { Theme } from 'src/styles/styled' // Adjust path if needed

// --- Constants ---
const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'

const GOOGLE_COLORS_HEX = [GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN, GOOGLE_BLUE]

const PATH_STROKE_WEIGHT = 3.5 // Thickness of the drawn path
const EPICYCLE_STROKE_COLOR = '#FFFFFF' // Use theme.colors.text? Let's keep it white for contrast.
const NUM_POINTS_PER_SHAPE = 250 // Default number of points for complex shapes

// --- Type Definitions ---
interface Complex {
  re: number
  im: number
}

interface FourierTerm {
  freq: number
  amp: number
  phase: number
}

interface PathPoint {
  point: P5.Vector
  color: P5.Color
}

// Discrete Fourier Transform function (remains the same)
function dft(p5: P5, x: Complex[]): FourierTerm[] {
  const X: FourierTerm[] = []
  const N = x.length
  if (N === 0) return [] // Handle empty input

  for (let k = 0; k < N; k++) {
    let sumRe = 0
    let sumIm = 0
    for (let n = 0; n < N; n++) {
      const phi = (p5.TWO_PI * k * n) / N
      // Safe access to x[n]
      const currentPoint = x[n]
      if (currentPoint) {
        sumRe += currentPoint.re * p5.cos(phi) + currentPoint.im * p5.sin(phi)
        sumIm += -currentPoint.re * p5.sin(phi) + currentPoint.im * p5.cos(phi)
      }
    }
    sumRe = sumRe / N
    sumIm = sumIm / N

    const freq = k
    const amp = p5.sqrt(sumRe * sumRe + sumIm * sumIm)
    const phase = p5.atan2(sumIm, sumRe)
    X[k] = { freq, amp, phase }
  }
  return X
}

// --- Sketch Factory ---
const sketch =
  (appTheme: Theme) =>
  (p5: P5): void => {
    let time = 0
    let path: PathPoint[] = [] // Store points and their colors
    let drawing: Complex[] = [] // Input points for DFT
    let fourierX: FourierTerm[] = [] // Result of DFT
    let state: 'USER_DRAWING' | 'FOURIER_DRAWING' = 'FOURIER_DRAWING' // Start drawing Fourier result
    let currentShapeIndex = 0
    const shapes: (() => void)[] = [] // Array to hold shape loading functions
    let googleColors: P5.Color[] = [] // To store P5.Color objects

    // --- Shape Loading Functions ---

    function addPoint(x: number, y: number): void {
      drawing.push({ re: x, im: y })
    }

    function loadTriangle(): void {
      drawing = []
      const size = 100
      const stepsPerSide = Math.floor(NUM_POINTS_PER_SHAPE / 3)
      const h = (size * p5.sqrt(3)) / 2 // Height of equilateral triangle

      // Top vertex to bottom right
      for (let i = 0; i <= stepsPerSide; i++) {
        addPoint(
          p5.lerp(0, size / 2, i / stepsPerSide),
          p5.lerp(-h / 2, h / 2, i / stepsPerSide)
        )
      }
      // Bottom right to bottom left
      for (let i = 0; i <= stepsPerSide; i++) {
        addPoint(p5.lerp(size / 2, -size / 2, i / stepsPerSide), h / 2)
      }
      // Bottom left to top vertex
      for (let i = 0; i <= stepsPerSide; i++) {
        addPoint(
          p5.lerp(-size / 2, 0, i / stepsPerSide),
          p5.lerp(h / 2, -h / 2, i / stepsPerSide)
        )
      }
      startFourier()
    }

    function loadSquare(): void {
      drawing = []
      const size = 80
      const stepsPerSide = Math.floor(NUM_POINTS_PER_SHAPE / 4)
      // Top edge (-size, -size) to (size, -size)
      for (let i = 0; i < stepsPerSide; i++)
        addPoint(p5.lerp(-size, size, i / stepsPerSide), -size)
      // Right edge (size, -size) to (size, size)
      for (let i = 0; i < stepsPerSide; i++)
        addPoint(size, p5.lerp(-size, size, i / stepsPerSide))
      // Bottom edge (size, size) to (-size, size)
      for (let i = 0; i < stepsPerSide; i++)
        addPoint(p5.lerp(size, -size, i / stepsPerSide), size)
      // Left edge (-size, size) to (-size, -size)
      for (let i = 0; i < stepsPerSide; i++)
        addPoint(-size, p5.lerp(size, -size, i / stepsPerSide))
      startFourier()
    }

    function loadHeart(): void {
      drawing = []
      const scale = 10
      for (let i = 0; i < NUM_POINTS_PER_SHAPE; i++) {
        const t = p5.map(i, 0, NUM_POINTS_PER_SHAPE, 0, p5.TWO_PI)
        const x = scale * 16 * p5.pow(p5.sin(t), 3)
        const y =
          -scale *
          (13 * p5.cos(t) -
            5 * p5.cos(2 * t) -
            2 * p5.cos(3 * t) -
            p5.cos(4 * t))
        addPoint(x, y)
      }
      startFourier()
    }

    function loadLG(): void {
      drawing = []
      const size = 100
      const steps = Math.floor(NUM_POINTS_PER_SHAPE / 5) // Rough distribution
      // L shape
      addPoint(-size * 0.8, -size / 2) // Start top left
      for (let i = 0; i <= steps; i++)
        addPoint(-size * 0.8, p5.lerp(-size / 2, size / 2, i / steps)) // Down
      for (let i = 0; i <= steps; i++)
        addPoint(p5.lerp(-size * 0.8, -size * 0.3, i / steps), size / 2) // Right (bottom bar)

      // Gap - represent implicitly by jump in coordinates or add points
      // Let's add a few points for the gap to guide Fourier
      for (let i = 1; i <= 5; i++)
        addPoint(p5.lerp(-size * 0.3, -size * 0.2, i / 5), size / 2)

      // G shape (simplified C + bar)
      const gRadius = size * 0.4
      const gCenterX = size * 0.3
      const gCenterY = 0
      const gStartAngle = p5.PI * 1.2 // Start angle for G arc
      const gEndAngle = -p5.PI * 0.4 // End angle for G arc
      for (let i = 0; i <= steps * 2; i++) {
        // More steps for arc
        const angle = p5.lerp(gStartAngle, gEndAngle, i / (steps * 2))
        addPoint(
          gCenterX + gRadius * p5.cos(angle),
          gCenterY + gRadius * p5.sin(angle)
        )
      }
      // Inner bar of G
      const gInnerBarEndX = gCenterX
      const gInnerBarEndY = gCenterY
      const gInnerBarStartX = gCenterX + gRadius * p5.cos(gEndAngle)
      const gInnerBarStartY = gCenterY + gRadius * p5.sin(gEndAngle)
      for (let i = 0; i <= steps / 2; i++) {
        addPoint(
          p5.lerp(gInnerBarStartX, gInnerBarEndX, i / (steps / 2)),
          p5.lerp(gInnerBarStartY, gInnerBarEndY, i / (steps / 2))
        )
      }
      startFourier()
    }

    function loadStar(): void {
      drawing = []
      const outerRadius = 100
      const innerRadius = 50
      const numPoints = 5 // 5-pointed star
      const pointsPerSegment = Math.floor(
        NUM_POINTS_PER_SHAPE / (numPoints * 2)
      )

      for (let i = 0; i < numPoints; i++) {
        // Point on outer circle
        const angle1 = p5.map(
          i,
          0,
          numPoints,
          -p5.HALF_PI,
          p5.TWO_PI - p5.HALF_PI
        )
        const x1 = outerRadius * p5.cos(angle1)
        const y1 = outerRadius * p5.sin(angle1)

        // Point on inner circle
        const angle2 = angle1 + p5.PI / numPoints
        const x2 = innerRadius * p5.cos(angle2)
        const y2 = innerRadius * p5.sin(angle2)

        // Next point on outer circle (for interpolation end) - Variables not used
        // const nextI = (i + 1) % numPoints
        // const angle3 = p5.map(
        //   nextI,
        //   0,
        //   numPoints,
        //   -p5.HALF_PI,
        //   p5.TWO_PI - p5.HALF_PI
        // );
        // const x3 = outerRadius * p5.cos(angle3);
        // const y3 = outerRadius * p5.sin(angle3);

        // Interpolate from previous inner point (or starting outer) to current outer
        const prevAngle2 = angle1 - p5.PI / numPoints
        const prevX2 = innerRadius * p5.cos(prevAngle2)
        const prevY2 = innerRadius * p5.sin(prevAngle2)
        for (let j = 0; j <= pointsPerSegment; j++) {
          addPoint(
            p5.lerp(prevX2, x1, j / pointsPerSegment),
            p5.lerp(prevY2, y1, j / pointsPerSegment)
          )
        }

        // Interpolate from current outer to current inner
        for (let j = 0; j <= pointsPerSegment; j++) {
          addPoint(
            p5.lerp(x1, x2, j / pointsPerSegment),
            p5.lerp(y1, y2, j / pointsPerSegment)
          )
        }
      }
      startFourier()
    }

    function loadInfinity(): void {
      drawing = []
      const scale = 100
      for (let i = 0; i < NUM_POINTS_PER_SHAPE; i++) {
        const t = p5.map(i, 0, NUM_POINTS_PER_SHAPE, 0, p5.TWO_PI)
        // Parametric equation for Lemniscate of Bernoulli
        const scaleFactor = 2 / (3 - p5.cos(2 * t))
        const x = scale * scaleFactor * p5.cos(t)
        const y = (scale * scaleFactor * p5.sin(2 * t)) / 2
        addPoint(x, y)
      }
      startFourier()
    }

    function loadSpiral(): void {
      drawing = []
      const a = 0 // Start radius
      const b = 3 // How much radius increases per rotation
      const maxTheta = p5.TWO_PI * 4 // Number of rotations
      for (let i = 0; i < NUM_POINTS_PER_SHAPE; i++) {
        const theta = p5.map(i, 0, NUM_POINTS_PER_SHAPE, 0, maxTheta)
        const r = a + b * theta
        const x = r * p5.cos(theta)
        const y = r * p5.sin(theta)
        // Center the spiral a bit better visually if it grows large
        const offsetX = (-b * maxTheta) / 2
        addPoint(x + offsetX, y)
      }
      startFourier()
    }

    // --- End Shape Loading Functions ---

    function startFourier(): void {
      if (drawing.length === 0) {
        console.warn('Attempted to start Fourier with empty drawing array.')
        // Optionally load a default shape here
        if (shapes.length > 0) shapes[0]()
        // Load first shape as fallback
        else return // No shapes defined at all
      }
      state = 'FOURIER_DRAWING'
      fourierX = dft(p5, drawing)
      // Sort by amplitude (largest circles first) - visually more intuitive
      fourierX.sort((a, b) => b.amp - a.amp)
      time = 0
      path = [] // Clear previous path
    }

    // Helper to get color cycling through GOOGLE_COLORS based on time
    function getCycleColor(t: number): P5.Color {
      if (googleColors.length === 0) return p5.color(appTheme.colors.text) // Fallback

      const segment = p5.TWO_PI / googleColors.length
      const currentIndex = Math.floor(t / segment) % googleColors.length
      const nextIndex = (currentIndex + 1) % googleColors.length
      const lerpAmt = (t % segment) / segment

      const c1 = googleColors[currentIndex]
      const c2 = googleColors[nextIndex]

      if (!c1 || !c2) return p5.color(appTheme.colors.text) // Fallback if colors are invalid

      return p5.lerpColor(c1, c2, lerpAmt)
    }

    p5.setup = (): void => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)

      // Initialize P5.Color objects
      googleColors = GOOGLE_COLORS_HEX.map(hex => p5.color(hex))

      // Populate shapes array
      shapes.push(
        loadLG,
        loadHeart,
        loadStar,
        loadInfinity,
        loadSpiral,
        loadTriangle,
        loadSquare
      ) // Add all loaders

      // Shuffle the shapes array for random order initially (optional)
      // shapes.sort(() => Math.random() - 0.5);

      // Load the first shape
      if (shapes.length > 0) {
        shapes[currentShapeIndex]()
      } else {
        console.error('No shapes defined!')
      }
    }

    // Draws the epicycles (rotating circles and lines)
    function epicycles(
      x: number,
      y: number,
      rotation: number,
      fourier: FourierTerm[]
    ): P5.Vector {
      for (let i = 0; i < fourier.length; i++) {
        const term = fourier[i]
        if (!term) continue // Safety check

        const prevx = x
        const prevy = y
        const freq = term.freq
        const radius = term.amp
        const phase = term.phase

        // Only draw epicycle if radius is significant enough (performance/visual tweak)
        if (radius > 0.5) {
          x += radius * p5.cos(freq * time + phase + rotation)
          y += radius * p5.sin(freq * time + phase + rotation)

          // Use a semi-transparent theme color for epicycles
          const epicycleColor = p5.color(EPICYCLE_STROKE_COLOR) // Start with base color
          epicycleColor.setAlpha(60) // Set alpha for circle outline (fainter)
          p5.stroke(epicycleColor)
          p5.strokeWeight(1)
          p5.noFill()
          p5.ellipse(prevx, prevy, radius * 2)

          epicycleColor.setAlpha(100) // Set alpha for radius line (slightly stronger)
          p5.stroke(epicycleColor)
          p5.line(prevx, prevy, x, y)
        } else {
          // For very small terms, just accumulate position without drawing
          x += radius * p5.cos(freq * time + phase + rotation)
          y += radius * p5.sin(freq * time + phase + rotation)
        }
      }
      return p5.createVector(x, y)
    }

    p5.draw = (): void => {
      p5.clear() // Use clear for transparency

      if (state === 'FOURIER_DRAWING' && fourierX.length > 0) {
        const startX = p5.width / 2
        const startY = p5.height / 2

        // Calculate the endpoint of the epicycles for this frame
        const v = epicycles(startX, startY, 0, fourierX)

        // Get the color for this point in time
        const currentPathColor = getCycleColor(time)

        // Add the new point and its color to the path history
        path.unshift({ point: v, color: currentPathColor }) // Add to beginning

        // Limit path length to avoid memory issues / performance drag
        const maxPathLength = NUM_POINTS_PER_SHAPE * 1.5 // Allow slightly more than input points
        if (path.length > maxPathLength) {
          path.pop() // Remove the oldest point from the end
        }

        // Draw the path using individual lines for color changes
        p5.noFill()
        p5.strokeWeight(PATH_STROKE_WEIGHT) // Set desired thickness
        for (let i = 0; i < path.length - 1; i++) {
          const p1Data = path[i]
          const p2Data = path[i + 1]
          if (p1Data && p2Data) {
            // Ensure data exists
            p5.stroke(p1Data.color) // Use the color stored with the starting point of the segment
            p5.line(
              p1Data.point.x,
              p1Data.point.y,
              p2Data.point.x,
              p2Data.point.y
            )
          }
        }

        // Increment time
        const dt = p5.TWO_PI / fourierX.length
        time += dt

        // Check if cycle is complete
        if (time >= p5.TWO_PI - dt / 2) {
          // Use small tolerance
          time = 0 // Reset time
          path = [] // Clear path for the new shape

          // Switch to the next shape
          currentShapeIndex = (currentShapeIndex + 1) % shapes.length
          console.log(`Switching to shape index: ${currentShapeIndex}`)
          if (shapes[currentShapeIndex]) {
            shapes[currentShapeIndex]() // Load the new shape's data
          } else {
            console.error(`Invalid shape index: ${currentShapeIndex}`)
            // Handle error: maybe reset to index 0
            currentShapeIndex = 0
            if (shapes[0]) shapes[0]()
          }
        }
      } else if (state !== 'FOURIER_DRAWING') {
        // Handle other states if USER_DRAWING is re-enabled later
        p5.fill(appTheme.colors.text)
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.text('Waiting for input...', p5.width / 2, p5.height / 2)
      }
    }

    p5.windowResized = (): void => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      // Reload the current shape on resize to recalculate Fourier terms
      // This also resets the drawing progress (time=0, path=[])
      if (shapes.length > 0 && shapes[currentShapeIndex]) {
        console.log(
          `Window resized. Reloading shape index: ${currentShapeIndex}`
        )
        shapes[currentShapeIndex]()
      } else {
        console.warn(
          'Cannot reload shape on resize - no shapes available or index invalid.'
        )
        // Attempt to load the first shape as a fallback
        currentShapeIndex = 0
        if (shapes.length > 0 && shapes[0]) shapes[0]()
      }
    }
  }

export default sketch
