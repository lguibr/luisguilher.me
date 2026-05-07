// src/components/Core/Sketchs/BoidsSimulation/index.ts
import type P5 from 'p5'

const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_COLORS = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]

class Boid {
  p5: P5
  position: P5.Vector
  velocity: P5.Vector
  acceleration: P5.Vector
  r: number // Size
  maxforce: number // Maximum steering force
  maxspeed: number // Maximum speed
  color: string
  width: number
  height: number
  history: P5.Vector[] = [] // Array to store previous positions
  trailLength = 4 // Number of trail segments (reduced for performance)
  perceptionRadius = 50 // How far a boid can see neighbors

  constructor(p5: P5, x: number, y: number, width: number, height: number) {
    this.p5 = p5
    this.width = width
    this.height = height
    this.acceleration = p5.createVector(0, 0)
    // Replace p5.constructor.Vector.random2D()
    this.velocity = p5
      .createVector(p5.random(-1, 1), p5.random(-1, 1))
      .normalize()
    this.velocity.setMag(p5.random(4, 20)) // Random initial speed

    this.position = p5.createVector(x, y)
    this.r = 5.0 // Slightly larger boids
    this.maxspeed = 8 // Slightly faster max speed
    this.maxforce = 0.05
    this.color = p5.random(GOOGLE_COLORS)
  }

  // --- Flocking behavior methods ---
  flock(boids: Boid[]): void {
    const desiredseparation = 25.0
    const neighborDist = this.perceptionRadius

    const sepSteer = this.p5.createVector(0, 0)
    const aliSum = this.p5.createVector(0, 0)
    const cohSum = this.p5.createVector(0, 0)

    let sepCount = 0
    let aliCount = 0
    let cohCount = 0

    for (const other of boids) {
      if (other === this) continue

      const dx = this.position.x - other.position.x
      const dy = this.position.y - other.position.y
      const dSq = dx * dx + dy * dy

      if (dSq > 0 && dSq < neighborDist * neighborDist) {
        aliSum.add(other.velocity)
        aliCount++
        cohSum.add(other.position)
        cohCount++

        if (dSq < desiredseparation * desiredseparation) {
          const d = Math.sqrt(dSq)
          const diff = this.p5.createVector(dx, dy)
          diff.normalize()
          diff.div(d)
          sepSteer.add(diff)
          sepCount++
        }
      }
    }

    if (sepCount > 0) {
      sepSteer.div(sepCount)
    }
    if (sepSteer.mag() > 0) {
      sepSteer.normalize()
      sepSteer.mult(this.maxspeed)
      sepSteer.sub(this.velocity)
      sepSteer.limit(this.maxforce)
    }

    let aliSteer = this.p5.createVector(0, 0)
    if (aliCount > 0) {
      aliSum.div(aliCount)
      aliSum.normalize()
      aliSum.mult(this.maxspeed)
      aliSteer = this.p5.createVector(
        aliSum.x - this.velocity.x,
        aliSum.y - this.velocity.y
      )
      aliSteer.limit(this.maxforce)
    }

    let cohSteer = this.p5.createVector(0, 0)
    if (cohCount > 0) {
      cohSum.div(cohCount)
      cohSteer = this.seek(cohSum)
    }

    // Apply weights to forces
    sepSteer.mult(1.8) // Stronger separation
    aliSteer.mult(1.0)
    cohSteer.mult(1.0)

    this.applyForce(sepSteer)
    this.applyForce(aliSteer)
    this.applyForce(cohSteer)
  }

  applyForce(force: P5.Vector): void {
    this.acceleration.add(force)
  }

  seek(target: P5.Vector): P5.Vector {
    // Replace p5.constructor.Vector.sub() with manual creation
    const desired = this.p5.createVector(
      target.x - this.position.x,
      target.y - this.position.y
    )
    desired.normalize()
    desired.mult(this.maxspeed)
    // Replace p5.constructor.Vector.sub() with manual creation
    const steer = this.p5.createVector(
      desired.x - this.velocity.x,
      desired.y - this.velocity.y
    )
    steer.limit(this.maxforce)
    return steer
  }

  update(): void {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
    this.history.push(this.position.copy())
    if (this.history.length > this.trailLength) {
      this.history.splice(0, 1)
    }
  }

  render(): void {
    for (let i = 0; i < this.history.length; i++) {
      const pos = this.history[i]
      const alpha = this.p5.map(i, 0, this.history.length - 1, 0, 100)
      const trailColor = this.p5.color(this.color)
      trailColor.setAlpha(alpha)
      const theta = this.velocity.heading() + this.p5.PI / 2
      this.p5.push()
      this.p5.translate(pos.x, pos.y)
      this.p5.rotate(theta)
      this.p5.fill(trailColor)
      this.p5.noStroke()
      const trailR = this.r * ((i / (this.history.length - 1)) * 0.6 + 0.4)
      this.p5.beginShape()
      this.p5.vertex(0, -trailR * 1.5)
      this.p5.vertex(-trailR * 0.8, trailR * 1.5)
      this.p5.vertex(trailR * 0.8, trailR * 1.5)
      this.p5.endShape(this.p5.CLOSE)
      this.p5.pop()
    }
    const theta = this.velocity.heading() + this.p5.PI / 2
    this.p5.fill(this.color)
    this.p5.noStroke()
    this.p5.push()
    this.p5.translate(this.position.x, this.position.y)
    this.p5.rotate(theta)
    this.p5.beginShape()
    this.p5.vertex(0, -this.r * 2)
    this.p5.vertex(-this.r, this.r * 2)
    this.p5.vertex(this.r, this.r * 2)
    this.p5.endShape(this.p5.CLOSE)
    this.p5.pop()
  }

  borders(): void {
    if (this.position.x < -this.r) {
      this.position.x = this.width + this.r
      this.history = []
    }
    if (this.position.y < -this.r) {
      this.position.y = this.height + this.r
      this.history = []
    }
    if (this.position.x > this.width + this.r) {
      this.position.x = -this.r
      this.history = []
    }
    if (this.position.y > this.height + this.r) {
      this.position.y = -this.r
      this.history = []
    }
  }
}

const sketch =
  () =>
  (p5: P5): void => {
    const flock: Boid[] = []
    const numBoids = 512

    p5.setup = (): void => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      flock.length = 0
      for (let i = 0; i < numBoids; i++) {
        flock.push(
          new Boid(
            p5,
            p5.random(p5.width),
            p5.random(p5.height),
            p5.width,
            p5.height
          )
        )
      }
    }

    p5.draw = (): void => {
      p5.clear()
      for (const boid of flock) {
        boid.borders()
        boid.flock(flock)
        boid.update()
        boid.render()
      }
    }

    p5.windowResized = (): void => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      for (const boid of flock) {
        boid.width = p5.width
        boid.height = p5.height
      }
    }
  }

export default sketch
