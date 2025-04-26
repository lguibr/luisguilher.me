import type P5 from 'p5' // Use type import
// Removed theme import

// Removed Theme type definition

const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_COLORS = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]

class Star {
  p5: P5
  x: number
  y: number
  z: number
  pz: number // Previous Z
  maxSpeed: number
  width: number
  height: number
  color: string // Store the star's color

  constructor(p5: P5, width: number, height: number, maxSpeed: number) {
    this.p5 = p5
    this.width = width
    this.height = height
    this.maxSpeed = maxSpeed
    this.x = p5.random(-width / 2, width / 2)
    this.y = p5.random(-height / 2, height / 2)
    this.z = p5.random(width) // Start stars at different depths
    this.pz = this.z
    this.color = p5.random(GOOGLE_COLORS) // Assign a random Google color
  }

  update(speed: number) {
    this.z = this.z - speed
    if (this.z < 1) {
      // Reset star when it goes past the screen
      this.z = this.width
      this.x = this.p5.random(-this.width / 2, this.width / 2)
      this.y = this.p5.random(-this.height / 2, this.height / 2)
      this.pz = this.z
      this.color = this.p5.random(GOOGLE_COLORS) // Reassign color on reset
    }
  }

  show() {
    this.p5.fill(this.color) // Use the star's assigned color
    this.p5.noStroke()

    // Project 3D position to 2D screen coordinates
    const sx = this.p5.map(this.x / this.z, 0, 1, 0, this.width)
    const sy = this.p5.map(this.y / this.z, 0, 1, 0, this.height)

    // Calculate star size based on distance
    // const r = this.p5.map(this.z, 0, this.width, 8, 0); // Closer stars are bigger
    // this.p5.ellipse(sx, sy, r, r); // Drawing ellipse is optional

    // Calculate previous screen position for the trail
    const px = this.p5.map(this.x / this.pz, 0, 1, 0, this.width)
    const py = this.p5.map(this.y / this.pz, 0, 1, 0, this.height)

    this.pz = this.z // Update previous z for next frame

    // Draw the trail
    this.p5.stroke(this.color) // Use the star's color for the trail
    const speed = this.p5.abs(this.maxSpeed) // Use absolute speed for stroke weight mapping
    const strokeWeight = this.p5.map(speed, 0, this.maxSpeed, 1, 3) // Thicker trail at higher speeds
    this.p5.strokeWeight(strokeWeight)
    this.p5.line(px, py, sx, sy)
  }
}

const sketch =
  () =>
  // Removed _theme parameter
  (p5: P5): void => {
    const stars: Star[] = []
    const numStars = 800
    let speed: number

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight) // Use window dimensions
      stars.length = 0 // Clear stars on setup
      for (let i = 0; i < numStars; i++) {
        stars[i] = new Star(p5, p5.width, p5.height, 50) // Max speed 50
      }
    }

    p5.draw = () => {
      speed = 20 // Fixed speed example
      p5.clear() // Use clear() for transparency instead of background()
      p5.translate(p5.width / 2, p5.height / 2) // Center the origin

      for (let i = 0; i < stars.length; i++) {
        stars[i].update(speed)
        stars[i].show() // Pass theme if needed by show()
      }
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight) // Resize to window dimensions
      // Reinitialize stars for new dimensions
      stars.length = 0 // Clear existing stars
      for (let i = 0; i < numStars; i++) {
        stars[i] = new Star(p5, p5.width, p5.height, 50)
      }
    }
  }

export default sketch
