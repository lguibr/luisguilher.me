// src/components/Core/Sketchs/NoiseFlowField/index.ts
import type P5 from 'p5'

const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_COLORS = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]

let rows: number

class Particle {
  p5: P5
  pos: P5.Vector
  vel: P5.Vector
  acc: P5.Vector
  maxSpeed: number
  prevPos: P5.Vector
  color: string
  width: number
  height: number

  constructor(p5: P5, width: number, height: number) {
    this.p5 = p5
    this.width = width
    this.height = height
    this.pos = p5.createVector(p5.random(width), p5.random(height))
    this.vel = p5.createVector(0, 0)
    this.acc = p5.createVector(0, 0)
    this.maxSpeed = 3
    this.prevPos = this.pos.copy()
    this.color = p5.random(GOOGLE_COLORS) + 'E6'
  }

  update(): void {
    this.vel.add(this.acc)
    this.vel.limit(this.maxSpeed)
    this.pos.add(this.vel)
    this.acc.mult(0)
  }

  follow(vectors: P5.Vector[][], scl: number, cols: number): void {
    const x = this.p5.floor(this.pos.x / scl)
    const y = this.p5.floor(this.pos.y / scl)
    if (
      x >= 0 &&
      x < cols &&
      y >= 0 &&
      y < rows &&
      vectors[y] &&
      vectors[y][x]
    ) {
      const force = vectors[y][x]
      this.applyForce(force)
    }
  }

  applyForce(force: P5.Vector): void {
    this.acc.add(force)
  }

  show(): void {
    this.p5.stroke(this.color)
    this.p5.strokeWeight(6)
    this.p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
    this.updatePrev()
  }

  updatePrev(): void {
    this.prevPos.x = this.pos.x
    this.prevPos.y = this.pos.y
  }

  edges(): void {
    if (this.pos.x > this.width) {
      this.pos.x = 0
      this.updatePrev()
    }
    if (this.pos.x < 0) {
      this.pos.x = this.width
      this.updatePrev()
    }
    if (this.pos.y > this.height) {
      this.pos.y = 0
      this.updatePrev()
    }
    if (this.pos.y < 0) {
      this.pos.y = this.height
      this.updatePrev()
    }
  }
}

const sketch =
  () =>
  (p5: P5): void => {
    const inc = 0.1
    const scl = 10
    let cols: number
    let zoff = 0
    const particles: Particle[] = []
    const numParticles = 1024
    let flowfield: P5.Vector[][] = []

    function calculateFlowField(): void {
      flowfield = new Array(rows)
      let yoff = 0
      for (let y = 0; y < rows; y++) {
        flowfield[y] = new Array(cols)
        let xoff = 0
        for (let x = 0; x < cols; x++) {
          const angle = p5.noise(xoff, yoff, zoff) * p5.TWO_PI * 4
          // Replace p5.constructor.Vector.fromAngle() with p5.createVector()
          const v = p5.createVector(p5.cos(angle), p5.sin(angle))
          v.setMag(0.5)
          flowfield[y][x] = v
          xoff += inc
        }
        yoff += inc
      }
      zoff += 0.005
    }

    p5.setup = (): void => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      cols = p5.floor(p5.width / scl)
      rows = p5.floor(p5.height / scl)
      calculateFlowField()
      particles.length = 0
      for (let i = 0; i < numParticles; i++) {
        particles[i] = new Particle(p5, p5.width, p5.height)
      }
    }

    p5.draw = (): void => {
      p5.clear()
      calculateFlowField()
      for (let i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield, scl, cols)
        particles[i].update()
        particles[i].edges()
        particles[i].show()
      }
    }

    p5.windowResized = (): void => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      p5.setup()
    }
  }

export default sketch
