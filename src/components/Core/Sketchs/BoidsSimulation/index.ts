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
  trailLength = 10 // Number of trail segments
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
    this.velocity.setMag(p5.random(2, 10)) // Random initial speed

    this.position = p5.createVector(x, y)
    this.r = 5.0 // Slightly larger boids
    this.maxspeed = 4 // Slightly faster max speed
    this.maxforce = 0.05
    this.color = p5.random(GOOGLE_COLORS)
  }

  // --- Flocking behavior methods ---
  flock(boids: Boid[]): void {
    const sep = this.separate(boids)
    const ali = this.align(boids)
    const coh = this.cohesion(boids)

    // Apply weights to forces
    sep.mult(1.8) // Stronger separation
    ali.mult(1.0)
    coh.mult(1.0)

    this.applyForce(sep)
    this.applyForce(ali)
    this.applyForce(coh)
  }

  applyForce(force: P5.Vector): void {
    this.acceleration.add(force)
  }

  // Separation: steer away from neighbors to avoid crowding
  separate(boids: Boid[]): P5.Vector {
    const desiredseparation = 25.0
    const steer = this.p5.createVector(0, 0)
    let count = 0
    for (const other of boids) {
      // Replace p5.constructor.Vector.dist() with p5.dist()
      const d = this.p5.dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      )
      if (d > 0 && d < desiredseparation) {
        // Replace p5.constructor.Vector.sub() with manual creation
        const diff = this.p5.createVector(
          this.position.x - other.position.x,
          this.position.y - other.position.y
        )
        diff.normalize()
        diff.div(d) // Weight by distance
        steer.add(diff)
        count++
      }
    }
    if (count > 0) {
      steer.div(count)
    }
    if (steer.mag() > 0) {
      steer.normalize()
      steer.mult(this.maxspeed)
      steer.sub(this.velocity) // Instance method is fine
      steer.limit(this.maxforce)
    }
    return steer
  }

  // Alignment: steer towards the average heading of neighbors
  align(boids: Boid[]): P5.Vector {
    const neighborDist = this.perceptionRadius
    const sum = this.p5.createVector(0, 0)
    let count = 0
    for (const other of boids) {
      // Replace p5.constructor.Vector.dist() with p5.dist()
      const d = this.p5.dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      )
      if (d > 0 && d < neighborDist) {
        sum.add(other.velocity)
        count++
      }
    }
    if (count > 0) {
      sum.div(count)
      sum.normalize()
      sum.mult(this.maxspeed)
      // Replace p5.constructor.Vector.sub() with manual creation
      const steer = this.p5.createVector(
        sum.x - this.velocity.x,
        sum.y - this.velocity.y
      )
      steer.limit(this.maxforce)
      return steer
    } else {
      return this.p5.createVector(0, 0)
    }
  }

  // Cohesion: steer towards the average position (center of mass) of neighbors
  cohesion(boids: Boid[]): P5.Vector {
    const neighborDist = this.perceptionRadius
    const sum = this.p5.createVector(0, 0)
    let count = 0
    for (const other of boids) {
      // Replace p5.constructor.Vector.dist() with p5.dist()
      const d = this.p5.dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      )
      if (d > 0 && d < neighborDist) {
        sum.add(other.position)
        count++
      }
    }
    if (count > 0) {
      sum.div(count)
      return this.seek(sum)
    } else {
      return this.p5.createVector(0, 0)
    }
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
    const numBoids = 256

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
