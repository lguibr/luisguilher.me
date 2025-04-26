import type P5 from 'p5' // Use type import
// Removed theme import

// Removed Theme type definition

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

  constructor(p5: P5, x: number, y: number, width: number, height: number) {
    this.p5 = p5
    this.width = width
    this.height = height
    this.acceleration = p5.createVector(0, 0)
    this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 1))
    this.velocity.normalize()
    this.velocity.mult(p5.random(2, 4))

    this.position = p5.createVector(x, y)
    this.r = 3.0
    this.maxspeed = 3
    this.maxforce = 0.05
    this.color = p5.random(GOOGLE_COLORS)
  }

  flock(boids: Boid[]) {
    const sep = this.separate(boids)
    const ali = this.align(boids)
    const coh = this.cohesion(boids)
    sep.mult(1.5)
    ali.mult(1.0)
    coh.mult(1.0)
    this.applyForce(sep)
    this.applyForce(ali)
    this.applyForce(coh)
  }

  applyForce(force: P5.Vector) {
    this.acceleration.add(force)
  }

  update() {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  separate(boids: Boid[]): P5.Vector {
    const desiredseparation = 25.0
    const steer = this.p5.createVector(0, 0)
    let count = 0
    for (const other of boids) {
      const d = this.position.dist(other.position)
      if (d > 0 && d < desiredseparation) {
        const diff = this.p5.constructor.Vector.sub(
          this.position,
          other.position
        )
        diff.normalize()
        diff.div(d)
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
      steer.sub(this.velocity)
      steer.limit(this.maxforce)
    }
    return steer
  }

  align(boids: Boid[]): P5.Vector {
    const neighbordist = 50
    const sum = this.p5.createVector(0, 0)
    let count = 0
    for (const other of boids) {
      const d = this.position.dist(other.position)
      if (d > 0 && d < neighbordist) {
        sum.add(other.velocity)
        count++
      }
    }
    if (count > 0) {
      sum.div(count)
      sum.normalize()
      sum.mult(this.maxspeed)
      const steer = this.p5.constructor.Vector.sub(sum, this.velocity)
      steer.limit(this.maxforce)
      return steer
    } else {
      return this.p5.createVector(0, 0)
    }
  }

  cohesion(boids: Boid[]): P5.Vector {
    const neighbordist = 50
    const sum = this.p5.createVector(0, 0)
    let count = 0
    for (const other of boids) {
      const d = this.position.dist(other.position)
      if (d > 0 && d < neighbordist) {
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
    const desired = this.p5.constructor.Vector.sub(target, this.position)
    desired.normalize()
    desired.mult(this.maxspeed)
    const steer = this.p5.constructor.Vector.sub(desired, this.velocity)
    steer.limit(this.maxforce)
    return steer
  }

  render() {
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

  borders() {
    if (this.position.x < -this.r) this.position.x = this.width + this.r
    if (this.position.y < -this.r) this.position.y = this.height + this.r
    if (this.position.x > this.width + this.r) this.position.x = -this.r
    if (this.position.y > this.height + this.r) this.position.y = -this.r
  }
}

const sketch =
  () =>
  // Removed _appTheme parameter
  (p5: P5): void => {
    const flock: Boid[] = []
    const numBoids = 150

    p5.setup = () => {
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

    p5.draw = () => {
      p5.clear() // Use clear() for transparency
      for (const boid of flock) {
        boid.borders()
        boid.flock(flock)
        boid.update()
        boid.render()
      }
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      // Re-initialize boids on resize to fit new dimensions
      p5.setup()
    }
  }

export default sketch
