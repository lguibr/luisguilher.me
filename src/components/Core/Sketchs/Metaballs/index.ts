import type P5 from 'p5' // Use type import
// Removed theme import

// Removed Theme type definition

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

  update() {
    this.pos.add(this.vel)
    if (this.pos.x < this.r || this.pos.x > this.width - this.r) {
      this.vel.x *= -1
    }
    if (this.pos.y < this.r || this.pos.y > this.height - this.r) {
      this.vel.y *= -1
    }
  }
}

const sketch =
  () =>
  // Removed _appTheme parameter
  (p5: P5): void => {
    const balls: Ball[] = []
    const numBalls = 10
    let res = 5

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      p5.colorMode(p5.RGB, 255)
      balls.length = 0
      for (let i = 0; i < numBalls; i++) {
        balls.push(new Ball(p5, p5.width, p5.height))
      }
      res = p5.max(5, p5.floor(p5.min(p5.width, p5.height) / 100))
    }

    p5.draw = () => {
      p5.clear() // Use clear() for transparency
      // Removed loadPixels() as we are using rect()

      for (let y = 0; y < p5.height; y += res) {
        for (let x = 0; x < p5.width; x += res) {
          let sum = 0
          for (let i = 0; i < balls.length; i++) {
            const ball = balls[i]
            const d = p5.dist(x, y, ball.pos.x, ball.pos.y)
            // Avoid division by zero or very small distances
            if (d > 0.1) {
              sum += (60 * ball.r) / d
            } else {
              sum = Infinity // Treat as inside a ball if distance is negligible
            }
          }

          let dominantColor = p5.color(0, 0, 0, 0) // Default to transparent
          let maxInfluence = 0
          const threshold = 80 // Threshold for metaball effect

          if (sum > threshold) {
            // Find the most influential ball for color
            for (let i = 0; i < balls.length; i++) {
              const ball = balls[i]
              const d = p5.dist(x, y, ball.pos.x, ball.pos.y)
              let influence = 0
              if (d > 0.1) {
                influence = (60 * ball.r) / d
              } else {
                influence = Infinity
              }

              if (influence > maxInfluence) {
                maxInfluence = influence
                dominantColor = p5.color(ball.color)
              }
            }
            // Optional: Adjust alpha based on how much sum exceeds threshold
            const alpha = p5.map(
              sum,
              threshold,
              threshold * 1.5,
              150,
              255,
              true
            )
            dominantColor.setAlpha(alpha)
          }

          p5.fill(dominantColor)
          p5.noStroke()
          p5.rect(x, y, res, res) // Draw colored rectangle
        }
      }
      // No need to updatePixels if not directly manipulating pixel array

      for (let i = 0; i < balls.length; i++) {
        balls[i].update()
      }
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      p5.setup()
    }
  }

export default sketch
