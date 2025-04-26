// src/components/Core/Sketchs/Hypercube/index.ts
import P5 from 'p5' // Import P5 namespace for static access
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

// Google Colors
const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_COLORS_STR = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]

// Extend P5.Vector type definition locally if needed for 'w'
// This is a common approach if @types/p5 doesn't include 'w'
declare module 'p5' {
  interface Vector {
    w?: number
  }
}

const sketch =
  (appTheme: Theme) =>
  (p5: P5): void => {
    let angle = 0
    const points: P5.Vector[] = []
    let projected3d: P5.Vector[] = []
    let googleColors: P5.Color[] = [] // Store p5.Color objects
    let colorIndex = 0
    let lerpAmount = 0
    const colorChangeSpeed = 0.005 // Speed of color transition

    // --- Rotation Functions (remain the same) ---
    function rotateXY(v: P5.Vector, angle: number): P5.Vector {
      const r = p5.createVector()
      r.x = p5.cos(angle) * v.x - p5.sin(angle) * v.y
      r.y = p5.sin(angle) * v.x + p5.cos(angle) * v.y
      r.z = v.z
      r.w = v.w // Assign w
      return r
    }
    function rotateZW(v: P5.Vector, angle: number): P5.Vector {
      const r = p5.createVector()
      const z = v.z
      const w = v.w ?? 0 // Use nullish coalescing for safety if w is undefined
      r.x = v.x
      r.y = v.y
      r.z = p5.cos(angle) * z - p5.sin(angle) * w
      r.w = p5.sin(angle) * z + p5.cos(angle) * w // Assign w
      return r
    }
    function rotateXW(v: P5.Vector, angle: number): P5.Vector {
      const r = p5.createVector()
      const x = v.x
      const w = v.w ?? 0 // Use nullish coalescing for safety
      r.x = p5.cos(angle) * x - p5.sin(angle) * w
      r.y = v.y
      r.z = v.z
      r.w = p5.sin(angle) * x + p5.cos(angle) * w // Assign w
      return r
    }
    // --- End Rotation Functions ---

    p5.setup = (): void => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL)
      // Convert hex colors to p5.Color objects
      googleColors = GOOGLE_COLORS_STR.map(c => p5.color(c))
      points.length = 0 // Clear points on setup
      for (let i = 0; i < 16; i++) {
        const x = i & 1 ? 1 : -1
        const y = i & 2 ? 1 : -1
        const z = i & 4 ? 1 : -1
        const w = i & 8 ? 1 : -1
        const vec = p5.createVector(x, y, z)
        vec.w = w // Assign w property
        points[i] = vec
      }
    }

    p5.draw = (): void => {
      p5.clear() // Use clear() for transparency in WEBGL
      p5.orbitControl() // Allow user interaction

      projected3d = []

      for (let i = 0; i < points.length; i++) {
        let v = points[i]
        v = rotateXY(v, angle * 0.5)
        v = rotateZW(v, angle)
        v = rotateXW(v, angle * 1.5)

        const w = v.w ?? 1 // Default w to 1 if undefined to avoid division by zero in perspective
        const distance = 2
        // Add safety check for perspectiveFactor denominator
        const denominator = distance - w
        const perspectiveFactor = denominator === 0 ? 1000 : 1 / denominator // Avoid infinity

        const projected = p5.createVector(
          v.x * perspectiveFactor,
          v.y * perspectiveFactor,
          v.z * perspectiveFactor
        )
        projected3d[i] = projected.mult(100)
      }

      // Draw points
      p5.stroke(appTheme.colors.text)
      p5.strokeWeight(8) // Point size
      p5.noFill()
      for (let i = 0; i < projected3d.length; i++) {
        // Add checks for NaN/Infinity before drawing
        if (
          Number.isFinite(projected3d[i].x) &&
          Number.isFinite(projected3d[i].y) &&
          Number.isFinite(projected3d[i].z)
        ) {
          p5.point(projected3d[i].x, projected3d[i].y, projected3d[i].z)
        }
      }

      // --- Color Transition Logic ---
      lerpAmount += colorChangeSpeed
      if (lerpAmount >= 1.0) {
        lerpAmount = 0 // Reset lerp amount
        colorIndex = (colorIndex + 1) % googleColors.length // Move to next color index
      }
      const currentColorIndex = colorIndex
      const nextColorIndex = (colorIndex + 1) % googleColors.length
      const currentLineColor = p5.lerpColor(
        googleColors[currentColorIndex],
        googleColors[nextColorIndex],
        lerpAmount
      )
      // --- End Color Transition Logic ---

      // Draw connecting lines with transitioning color
      p5.stroke(currentLineColor) // Use the calculated lerped color
      p5.strokeWeight(3) // Increased line thickness
      for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
          const diff = i ^ j
          // Check if projected points are valid before drawing line
          if (
            (diff & (diff - 1)) === 0 &&
            projected3d[i] &&
            projected3d[j] &&
            Number.isFinite(projected3d[i].x) &&
            Number.isFinite(projected3d[i].y) &&
            Number.isFinite(projected3d[i].z) &&
            Number.isFinite(projected3d[j].x) &&
            Number.isFinite(projected3d[j].y) &&
            Number.isFinite(projected3d[j].z)
          ) {
            p5.line(
              projected3d[i].x,
              projected3d[i].y,
              projected3d[i].z,
              projected3d[j].x,
              projected3d[j].y,
              projected3d[j].z
            )
          }
        }
      }

      angle += 0.01 // Increment rotation angle
    }

    p5.windowResized = (): void => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      // Re-initialize colors in case p5 instance changed (though unlikely here)
      googleColors = GOOGLE_COLORS_STR.map(c => p5.color(c))
    }
  }

export default sketch
