import type P5 from 'p5' // Use type import
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

const GOOGLE_RED = '#DB4437'
const GOOGLE_BLUE = '#4285F4'
const GOOGLE_YELLOW = '#F4B400' // Add yellow for color interpolation

const sketch =
  (
    appTheme: Theme // Renamed theme variable
  ) =>
  (p5: P5): void => {
    let r1 = 150 // Length of first arm
    let r2 = 150 // Length of second arm
    const m1 = 20 // Mass of first bob
    const m2 = 20 // Mass of second bob
    let a1 = p5.PI / 2 // Initial angle of first arm
    let a2 = p5.PI / 4 // Initial angle of second arm
    let a1v = 0 // Initial velocity of first angle (camelCase)
    let a2v = 0 // Initial velocity of second angle (camelCase)
    const g = 1 // Gravity

    let px2 = -1 // Previous x position of second bob
    let py2 = -1 // Previous y position of second bob
    let cx: number, cy: number // Center coordinates

    let buffer: P5.Graphics // Graphics buffer for drawing the trace

    // Colors for interpolation
    let color1: P5.Color
    let color2: P5.Color

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      p5.pixelDensity(1) // Ensure buffer matches canvas density
      cx = p5.width / 2
      cy = p5.height / 3

      // Initialize buffer
      buffer = p5.createGraphics(p5.width, p5.height)
      buffer.background(appTheme.colors.editorBackground + '00') // Fully transparent background
      buffer.translate(cx, cy) // Translate once

      // Initialize colors
      color1 = p5.color(GOOGLE_RED)
      color2 = p5.color(GOOGLE_YELLOW)

      // Adjust arm lengths based on initial canvas size
      const minDim = Math.min(p5.width, p5.height)
      r1 = minDim * 0.25
      r2 = minDim * 0.25

      // Reset previous positions
      px2 = -1
      py2 = -1
    }

    p5.draw = () => {
      p5.clear() // Use clear() for transparency on main canvas

      // --- Physics Calculation ---
      const num1 = -g * (2 * m1 + m2) * p5.sin(a1)
      const num2 = -m2 * g * p5.sin(a1 - 2 * a2)
      const num3 = -2 * p5.sin(a1 - a2) * m2
      const num4 = a2v * a2v * r2 + a1v * a1v * r1 * p5.cos(a1 - a2) // Use camelCase
      const den = r1 * (2 * m1 + m2 - m2 * p5.cos(2 * a1 - 2 * a2))
      const a1a = (num1 + num2 + num3 * num4) / den // Use camelCase

      const num5 = 2 * p5.sin(a1 - a2)
      const num6 = a1v * a1v * r1 * (m1 + m2) // Use camelCase
      const num7 = g * (m1 + m2) * p5.cos(a1)
      const num8 = a2v * a2v * r2 * m2 * p5.cos(a1 - a2) // Use camelCase
      const den2 = r2 * (2 * m1 + m2 - m2 * p5.cos(2 * a1 - 2 * a2))
      const a2a = (num5 * (num6 + num7 + num8)) / den2 // Use camelCase

      // Apply damping to velocities (optional, makes it less chaotic over time)
      // a1v *= 0.999;
      // a2v *= 0.999;

      a1v += a1a * 0.1 // Time step scaling factor (Use camelCase)
      a2v += a2a * 0.1 // Use camelCase
      a1 += a1v * 0.1 // Use camelCase
      a2 += a2v * 0.1 // Use camelCase
      // --- End Physics ---

      // Calculate bob positions
      const x1 = r1 * p5.sin(a1)
      const y1 = r1 * p5.cos(a1)
      const x2 = x1 + r2 * p5.sin(a2)
      const y2 = y1 + r2 * p5.cos(a2)

      // Calculate velocity of the second bob for effects
      const x2Vel = x2 - px2 // Use camelCase
      const y2Vel = y2 - py2 // Use camelCase
      const speed = p5.sqrt(x2Vel * x2Vel + y2Vel * y2Vel) // Use camelCase

      // Draw trace onto the buffer
      if (px2 !== -1) {
        // Map speed to color and thickness
        const maxSpeed = 15 // Adjust this based on observed speeds
        const lerpAmt = p5.constrain(p5.map(speed, 0, maxSpeed, 0, 1), 0, 1)
        const trailColor = p5.lerpColor(color1, color2, lerpAmt)
        const trailWeight = p5.map(speed, 0, maxSpeed, 2, 6) // Thicker trail (2 to 6 pixels)

        buffer.stroke(trailColor)
        buffer.strokeWeight(trailWeight)
        buffer.line(px2, py2, x2, y2)
      }
      // Update previous positions AFTER drawing the line
      px2 = x2
      py2 = y2

      // Draw buffer onto the main canvas
      p5.imageMode(p5.CORNER)
      p5.image(buffer, 0, 0, p5.width, p5.height)

      // Draw pendulum arms and bobs on main canvas (over the buffer)
      p5.push() // Isolate drawing styles
      p5.translate(cx, cy) // Translate drawing context
      p5.stroke(appTheme.colors.text) // Arm color
      p5.strokeWeight(2) // Arm thickness

      // Arm 1
      p5.line(0, 0, x1, y1)
      p5.fill(GOOGLE_BLUE) // Bob 1 color
      p5.noStroke() // No outline for bobs
      p5.ellipse(x1, y1, m1, m1) // Bob 1

      // Arm 2
      p5.stroke(appTheme.colors.text) // Reset stroke for the arm
      p5.strokeWeight(2)
      p5.line(x1, y1, x2, y2)
      p5.fill(GOOGLE_BLUE) // Bob 2 color
      p5.noStroke()
      p5.ellipse(x2, y2, m2, m2) // Bob 2
      p5.pop() // Restore drawing styles
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      cx = p5.width / 2
      cy = p5.height / 3

      // Recreate and clear buffer with new dimensions
      buffer.resizeCanvas(p5.width, p5.height)
      buffer.background(appTheme.colors.editorBackground + '00') // Ensure transparency
      buffer.translate(cx, cy) // Re-apply translation

      // Re-initialize colors (in case color mode was reset)
      color1 = p5.color(GOOGLE_RED)
      color2 = p5.color(GOOGLE_YELLOW)

      // Adjust arm lengths
      const minDim = Math.min(p5.width, p5.height)
      r1 = minDim * 0.25
      r2 = minDim * 0.25

      // Reset angles/velocities and previous positions
      a1 = p5.PI / 2
      a2 = p5.PI / 4
      a1v = 0 // Use camelCase
      a2v = 0 // Use camelCase
      px2 = -1
      py2 = -1
    }
  }

export default sketch
