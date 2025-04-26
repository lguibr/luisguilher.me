// src/components/Core/Sketchs/HexagonCollision/index.ts
import type P5 from 'p5'

const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_COLORS = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]

class Particle {
  p5: P5
  pos: P5.Vector
  vel: P5.Vector
  acc: P5.Vector
  mass: number
  radius: number
  color: string
  isTriangle: boolean
  angle: number
  angularVel: number

  constructor(
    p5: P5,
    x: number,
    y: number,
    isTriangle = false,
    color?: string,
    parentRadius?: number
  ) {
    this.p5 = p5
    this.pos = p5.createVector(x, y)
    this.vel = p5.createVector(p5.random(-1, 1), p5.random(-1, 1))
    this.vel.normalize()
    this.vel.mult(p5.random(1, 6))
    this.acc = p5.createVector(0, 0)
    if (isTriangle) {
      const baseRadius = parentRadius || 30
      this.radius = baseRadius * 0.35
      this.mass = baseRadius * 0.15
    } else {
      this.radius = p5.random(20, 45)
      this.mass = this.radius * 0.7
    }
    this.color = color || p5.random(GOOGLE_COLORS)
    this.isTriangle = isTriangle
    this.angle = p5.random(p5.TWO_PI)
    this.angularVel = p5.random(-0.05, 0.05)
  }

  applyForce(force: P5.Vector): void {
    // Replace p5.constructor.Vector.div() with manual creation
    const f = this.p5.createVector(force.x / this.mass, force.y / this.mass)
    this.acc.add(f)
  }

  update(): void {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.angle += this.angularVel
    this.edges()
  }

  collide(other: Particle): void {
    // Replace p5.constructor.Vector.sub() with manual creation
    const distanceVect = this.p5.createVector(
      other.pos.x - this.pos.x,
      other.pos.y - this.pos.y
    )
    const distanceMag = distanceVect.mag()
    const minDistance = this.radius + other.radius

    if (distanceMag < minDistance) {
      const distanceCorrection = (minDistance - distanceMag) / 2.0
      const d = distanceVect.copy()
      const correctionVector = d.normalize().mult(distanceCorrection)
      other.pos.add(correctionVector)
      this.pos.sub(correctionVector) // Instance sub is fine
      const angleOfCollision = distanceVect.heading()
      const sine = this.p5.sin(angleOfCollision)
      const cosine = this.p5.cos(angleOfCollision)
      const v1 = this.p5.createVector(
        cosine * this.vel.x + sine * this.vel.y,
        cosine * this.vel.y - sine * this.vel.x
      )
      const v2 = this.p5.createVector(
        cosine * other.vel.x + sine * other.vel.y,
        cosine * other.vel.y - sine * other.vel.x
      )
      const v1FinalX =
        ((this.mass - other.mass) * v1.x + 2 * other.mass * v2.x) /
        (this.mass + other.mass)
      const v2FinalX =
        ((other.mass - this.mass) * v2.x + 2 * this.mass * v1.x) /
        (this.mass + other.mass)
      v1.x = v1FinalX
      v2.x = v2FinalX
      this.vel.x = cosine * v1.x - sine * v1.y
      this.vel.y = cosine * v1.y + sine * v1.x
      other.vel.x = cosine * v2.x - sine * v2.y
      other.vel.y = cosine * v2.y + sine * v2.x
    }
  }

  display(): void {
    this.p5.push()
    this.p5.translate(this.pos.x, this.pos.y)
    this.p5.rotate(this.angle)
    this.p5.noStroke()
    this.p5.fill(this.color)
    if (this.isTriangle) {
      this.p5.triangle(
        0,
        -this.radius,
        -this.radius * 0.866,
        this.radius * 0.5,
        this.radius * 0.866,
        this.radius * 0.5
      )
    } else {
      const angleStep = this.p5.TWO_PI / 6
      this.p5.beginShape()
      for (let a = 0; a < this.p5.TWO_PI; a += angleStep) {
        const sx = this.p5.cos(a) * this.radius
        const sy = this.p5.sin(a) * this.radius
        this.p5.vertex(sx, sy)
      }
      this.p5.endShape(this.p5.CLOSE)
    }
    this.p5.pop()
  }

  edges(): void {
    if (this.pos.x > this.p5.width + this.radius) {
      this.pos.x = -this.radius
    } else if (this.pos.x < -this.radius) {
      this.pos.x = this.p5.width + this.radius
    }
    if (this.pos.y > this.p5.height + this.radius) {
      this.pos.y = -this.radius
    } else if (this.pos.y < -this.radius) {
      this.pos.y = this.p5.height + this.radius
    }
  }
}

const sketch =
  () =>
  (p5: P5): void => {
    const particles: Particle[] = []
    const numHexagons = 10
    const releaseInterval = 60
    const maxParticles = 500

    p5.setup = (): void => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      particles.length = 0
      for (let i = 0; i < numHexagons; i++) {
        particles.push(
          new Particle(
            p5,
            p5.random(p5.width),
            p5.random(p5.height),
            false,
            p5.random(GOOGLE_COLORS)
          )
        )
      }
    }

    p5.draw = (): void => {
      p5.clear()
      if (p5.frameCount % releaseInterval === 0) {
        particles.forEach(p => {
          if (!p.isTriangle) {
            const releaseAngle = p.angle + p5.PI
            const releasePos = p5
              .createVector(p5.cos(releaseAngle), p5.sin(releaseAngle))
              .mult(p.radius * 1.1)
              .add(p.pos)
            const newTriangle = new Particle(
              p5,
              releasePos.x,
              releasePos.y,
              true,
              p.color,
              p.radius
            )
            // Replace p5.constructor.Vector.sub() with manual creation
            newTriangle.vel = p5
              .createVector(releasePos.x - p.pos.x, releasePos.y - p.pos.y)
              .normalize()
              .mult(p5.random(3, 5))
            newTriangle.angularVel = p.angularVel * p5.random(1.5, 2.5)
            particles.push(newTriangle)
          }
        })
      }
      while (particles.length > maxParticles) {
        const oldestTriangleIndex = particles.findIndex(p => p.isTriangle)
        if (oldestTriangleIndex !== -1) {
          particles.splice(oldestTriangleIndex, 1)
        } else {
          particles.shift()
        }
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          particles[i].collide(particles[j])
        }
        particles[i].update()
        particles[i].display()
      }
    }

    p5.windowResized = (): void => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      p5.setup()
    }
  }

export default sketch
