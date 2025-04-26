// src/components/Core/Sketchs/Metaballs/index.ts
import type P5 from 'p5' // Use type import

const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_COLORS = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]

class Ball {
  p5: P5
  pos: P5.Vector
  vel: P5.Vector
  r: number // Radius
  color: string
  width: number
  height: number

  constructor(p5: P5, width: number, height: number) {
    this.p5 = p5
    this.width = width
    this.height = height
    this.pos = p5.createVector(p5.random(width), p5.random(height))
    this.vel = p5.createVector(p5.random(-1, 1), p5.random(-1, 1))
    this.vel.normalize()
    this.vel.mult(p5.random(0.5, 1.5))

    this.r = p5.random(30, 60)
    this.color = p5.random(GOOGLE_COLORS)
  }

  update(): void {
    this.pos.add(this.vel)
    // Bounce off edges
    if (this.pos.x < this.r || this.pos.x > this.width - this.r) {
      this.vel.x *= -1
      this.pos.x = this.p5.constrain(this.pos.x, this.r, this.width - this.r) // Prevent sticking
    }
    if (this.pos.y < this.r || this.pos.y > this.height - this.r) {
      this.vel.y *= -1
      this.pos.y = this.p5.constrain(this.pos.y, this.r, this.height - this.r) // Prevent sticking
    }
  }
}

const sketch =
  () =>
  // Removed theme parameter
  (p5: P5): void => {
    const balls: Ball[] = []
    const numBalls = 8 // Slightly fewer balls might be needed for performance
    let res = 3 // Decreased resolution (smaller pixel blocks)
    // let googleColorsP5: P5.Color[] = []; // Variable is assigned but never used - removing

    p5.setup = (): void => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      p5.colorMode(p5.RGB, 255) // Ensure RGB mode
      // googleColorsP5 = GOOGLE_COLORS.map(c => p5.color(c)); // Variable is assigned but never used - removing
      balls.length = 0
      for (let i = 0; i < numBalls; i++) {
        balls.push(new Ball(p5, p5.width, p5.height))
        // Assign p5.Color object directly if needed later, though hex string is fine for fill
        balls[i].color = p5.random(GOOGLE_COLORS) // Keep assigning hex string for simplicity
      }
      // Adjust res based on canvas size (optional, but good for performance)
      res = p5.max(2, p5.floor(p5.min(p5.width, p5.height) / 150)) // Smaller res for larger screens
      console.log(`Metaballs resolution set to: ${res}`)
    }

    p5.draw = (): void => {
      p5.clear() // Use clear() for transparency

      // Iterate through grid based on resolution
      for (let y = 0; y < p5.height; y += res) {
        for (let x = 0; x < p5.width; x += res) {
          let sum = 0
          let maxInfluence = 0
          let dominantColorStr = GOOGLE_COLORS[0] // Default color if needed

          for (let i = 0; i < balls.length; i++) {
            const ball = balls[i]
            // Use distSq for performance (avoid sqrt)
            const dSq =
              (x - ball.pos.x) * (x - ball.pos.x) +
              (y - ball.pos.y) * (y - ball.pos.y)
            let influence = 0
            if (dSq > 1) {
              // Avoid division by zero
              influence = (ball.r * ball.r) / dSq // Use squared radius / squared distance
              sum += influence
            } else {
              sum = Infinity // Inside a ball
              influence = Infinity
            }

            // Track the ball with the most influence at this point
            if (influence > maxInfluence) {
              maxInfluence = influence
              dominantColorStr = ball.color // Store the hex string of the dominant ball
            }
          }

          const threshold = 1.0 // Adjust threshold based on new formula if needed

          if (sum > threshold) {
            const finalColor = p5.color(dominantColorStr) // Convert dominant hex string to p5.Color

            // Optional: Adjust alpha based on sum
            const alpha = p5.map(sum, threshold, threshold * 2, 150, 255, true)
            finalColor.setAlpha(alpha)

            p5.fill(finalColor)
            p5.noStroke()
            p5.rect(x, y, res, res) // Draw the pixel block
          }
        }
      }

      // Update ball positions
      for (let i = 0; i < balls.length; i++) {
        balls[i].update()
      }
    }

    p5.windowResized = (): void => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      // Re-run setup to adjust resolution and ball positions
      p5.setup()
    }
  }

export default sketch
