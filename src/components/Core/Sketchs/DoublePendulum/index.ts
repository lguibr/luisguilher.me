// src/components/Core/Sketchs/ZeroGravityPendulumFade/index.ts
import type P5 from 'p5'
import type { Theme } from 'src/styles/styled' // Adjusted path assumption

// --- Constants ---
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_BLUE = '#4285F4' // Bob color

// Simulation Parameters
const M1 = 20 // Mass of first bob
const M2 = 20 // Mass of second bob
const G = 2 // Gravity set to ZERO
// *** REDUCED Time Step for Stability ***
const TIME_STEP_MULTIPLIER = 0.15 // Significantly reduced from 0.5
// *** ADDED Damping Factor ***
const DAMPING = 0.9995 // Slightly less than 1 to prevent energy gain
const INITIAL_VELOCITY_RANGE = 0.6 // Still allow high starting velocities
const NOISE_INCREMENT = 0.002 // How fast the color noise evolves

// Trail Parameters
const FADE_AMOUNT = 1.5 // Alpha decrease per frame
const MAX_TRAIL_SEGMENTS = 600 // Max number of trail segments stored
const MIN_TRAIL_WEIGHT = 2
const MAX_TRAIL_WEIGHT = 20
// Adjust max speed visual based on the new time step if needed, though range might still work
const MAX_SPEED_VISUAL = 150 // Speed range for thickness mapping (may need tuning)

// --- Trail Segment Definition ---
interface TrailSegment {
  x1: number
  y1: number
  x2: number
  y2: number
  color: P5.Color
  strokeWeight: number
  alpha: number
}

// --- Sketch Factory ---
const sketch =
  (theme: Theme) =>
  (p5: P5): void => {
    // --- Pendulum State Variables ---
    let r1: number
    let r2: number
    let a1: number
    let a2: number
    let a1v: number
    let a2v: number

    // --- Trail / Drawing Variables ---
    let px2 = -1
    let py2 = -1
    let cx: number
    let cy: number
    let noiseTime = 0
    let trailSegments: TrailSegment[] = []

    // --- Colors ---
    let colorRed: P5.Color
    let colorYellow: P5.Color
    let colorGreen: P5.Color

    // --- Helper Functions ---

    function initializePendulumState() {
      a1 = p5.random(p5.TWO_PI)
      a2 = p5.random(p5.TWO_PI)
      a1v = p5.random(-INITIAL_VELOCITY_RANGE, INITIAL_VELOCITY_RANGE)
      a2v = p5.random(-INITIAL_VELOCITY_RANGE, INITIAL_VELOCITY_RANGE)
      px2 = -1
      py2 = -1
      noiseTime = p5.random(1000)
      trailSegments = []
      console.log('Pendulum state initialized/reset.') // Add log for debugging resets
    }

    function getTrailColor(): P5.Color {
      // (Function remains the same as before)
      if (!colorRed || !colorYellow || !colorGreen) {
        return p5.color(theme.colors.text) // Fallback
      }
      const phase = p5.noise(noiseTime)
      const third = 1 / 3
      if (phase < third) {
        const amt = p5.map(phase, 0, third, 0, 1)
        return p5.lerpColor(colorRed, colorYellow, amt)
      } else if (phase < 2 * third) {
        const amt = p5.map(phase, third, 2 * third, 0, 1)
        return p5.lerpColor(colorYellow, colorGreen, amt)
      } else {
        const amt = p5.map(phase, 2 * third, 1, 0, 1)
        return p5.lerpColor(colorGreen, colorRed, amt)
      }
    }

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      cx = p5.width / 2
      cy = p5.height / 3

      colorRed = p5.color(GOOGLE_RED)
      colorYellow = p5.color(GOOGLE_YELLOW)
      colorGreen = p5.color(GOOGLE_GREEN)

      const minDim = Math.min(p5.width, p5.height)
      r1 = minDim * 0.2
      r2 = minDim * 0.2

      initializePendulumState()
    }

    p5.draw = () => {
      p5.clear()

      // --- Physics Calculation (G=0) ---
      // Denominators first, check for potential zero division
      const denCommon = 2 * M1 + M2 - M2 * p5.cos(2 * a1 - 2 * a2)
      const den1 = r1 * denCommon
      const den2 = r2 * denCommon

      // Check for zero denominator (highly unlikely physically, but numerically possible)
      if (den1 === 0 || den2 === 0) {
        console.warn('Denominator reached zero, resetting simulation.')
        initializePendulumState()
        return // Skip the rest of the draw loop for this frame
      }

      const num1 = -G * (2 * M1 + M2) * p5.sin(a1) // G=0 -> 0
      const num2 = -M2 * G * p5.sin(a1 - 2 * a2) // G=0 -> 0
      const num3 = -2 * p5.sin(a1 - a2) * M2
      const num4 = a2v * a2v * r2 + a1v * a1v * r1 * p5.cos(a1 - a2)
      const a1a = (num1 + num2 + num3 * num4) / den1

      const num5 = 2 * p5.sin(a1 - a2)
      const num6 = a1v * a1v * r1 * (M1 + M2)
      const num7 = G * (M1 + M2) * p5.cos(a1) // G=0 -> 0
      const num8 = a2v * a2v * r2 * M2 * p5.cos(a1 - a2)
      const a2a = (num5 * (num6 + num7 + num8)) / den2

      // Update velocities WITH DAMPING
      a1v += a1a * TIME_STEP_MULTIPLIER
      a2v += a2a * TIME_STEP_MULTIPLIER
      a1v *= DAMPING // Apply damping
      a2v *= DAMPING // Apply damping

      // Update angles
      a1 += a1v * TIME_STEP_MULTIPLIER
      a2 += a2v * TIME_STEP_MULTIPLIER
      // --- End Physics ---

      // *** Sanity Check for NaN/Infinity ***
      if (
        !Number.isFinite(a1) ||
        !Number.isFinite(a2) ||
        !Number.isFinite(a1v) ||
        !Number.isFinite(a2v)
      ) {
        console.error('Simulation unstable (NaN/Infinity detected)! Resetting.')
        initializePendulumState()
        return // Skip the rest of the draw loop
      }

      // Calculate current bob positions (relative to 0,0)
      const x1 = r1 * p5.sin(a1)
      const y1 = r1 * p5.cos(a1)
      const x2 = x1 + r2 * p5.sin(a2)
      const y2 = y1 + r2 * p5.cos(a2)

      // --- Trail Management ---
      noiseTime += NOISE_INCREMENT

      if (px2 === -1 && py2 === -1 && p5.frameCount > 1) {
        px2 = x2
        py2 = y2
      }

      if (px2 !== -1 && py2 !== -1) {
        // Ensure previous positions are also finite before calculating speed/adding segment
        if (Number.isFinite(px2) && Number.isFinite(py2)) {
          const speed = p5.dist(x2, y2, px2, py2) / TIME_STEP_MULTIPLIER
          const trailWeight = p5.constrain(
            p5.map(
              speed,
              0,
              MAX_SPEED_VISUAL,
              MIN_TRAIL_WEIGHT,
              MAX_TRAIL_WEIGHT
            ),
            MIN_TRAIL_WEIGHT,
            MAX_TRAIL_WEIGHT
          )
          const trailColor = getTrailColor()

          const newSegment: TrailSegment = {
            x1: px2,
            y1: py2,
            x2: x2,
            y2: y2,
            color: trailColor,
            strokeWeight: trailWeight,
            alpha: 255
          }
          trailSegments.push(newSegment)
        } else {
          // If previous points were invalid, reset them to current valid points
          px2 = x2
          py2 = y2
        }
      }

      px2 = x2
      py2 = y2 // Update previous positions AFTER potentially adding segment

      while (trailSegments.length > MAX_TRAIL_SEGMENTS) {
        trailSegments.shift()
      }

      // --- Trail Drawing ---
      p5.push()
      p5.noFill()
      p5.translate(cx, cy)
      for (let i = trailSegments.length - 1; i >= 0; i--) {
        const seg = trailSegments[i]
        if (!seg) continue

        seg.alpha -= FADE_AMOUNT

        if (seg.alpha <= 0) {
          trailSegments.splice(i, 1)
        } else {
          const r = p5.red(seg.color)
          const g = p5.green(seg.color)
          const b = p5.blue(seg.color)
          p5.stroke(r, g, b, seg.alpha)
          p5.strokeWeight(seg.strokeWeight)
          // Check segment coordinates before drawing
          if (
            Number.isFinite(seg.x1) &&
            Number.isFinite(seg.y1) &&
            Number.isFinite(seg.x2) &&
            Number.isFinite(seg.y2)
          ) {
            p5.line(seg.x1, seg.y1, seg.x2, seg.y2)
          } else {
            // Silently remove corrupted segment data if it somehow occurs
            trailSegments.splice(i, 1)
          }
        }
      }
      p5.pop()

      // --- Pendulum Drawing ---
      p5.push()
      p5.translate(cx, cy)
      // (Pendulum drawing code remains the same)
      p5.stroke(theme.colors.text)
      p5.strokeWeight(2)
      p5.line(0, 0, x1, y1) // Arm 1
      p5.fill(GOOGLE_BLUE)
      p5.noStroke()
      p5.ellipse(x1, y1, M1, M1) // Bob 1
      p5.stroke(theme.colors.text)
      p5.strokeWeight(2)
      p5.line(x1, y1, x2, y2) // Arm 2
      p5.fill(GOOGLE_BLUE)
      p5.noStroke()
      p5.ellipse(x2, y2, M2, M2) // Bob 2
      p5.pop()
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      cx = p5.width / 2
      cy = p5.height / 3

      colorRed = p5.color(GOOGLE_RED)
      colorYellow = p5.color(GOOGLE_YELLOW)
      colorGreen = p5.color(GOOGLE_GREEN)

      const minDim = Math.min(p5.width, p5.height)
      r1 = minDim * 0.2
      r2 = minDim * 0.2

      initializePendulumState() // Reset on resize
    }
  }

export default sketch
