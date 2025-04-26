import type P5 from 'p5' // Use type import
// Removed theme import

// Removed Theme type definition

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
    color?: string
  ) {
    this.p5 = p5
    this.pos = p5.createVector(x, y)
    this.vel = p5.createVector(p5.random(-1, 1), p5.random(-1, 1))
    this.vel.normalize()
    this.vel.mult(p5.random(1, 3))

    this.acc = p5.createVector(0, 0)
    this.mass = isTriangle ? 5 : 20
    this.radius = isTriangle ? 10 : 30
    this.color = color || p5.random(GOOGLE_COLORS)
    this.isTriangle = isTriangle
    this.angle = p5.random(p5.TWO_PI)
    this.angularVel = p5.random(-0.05, 0.05)
  }

  applyForce(force: P5.Vector) {
    const f = this.p5.constructor.Vector.div(force, this.mass)
    this.acc.add(f)
  }

  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.angle += this.angularVel
    this.edges()
  }

  collide(other: Particle) {
    const distanceVect = this.p5.constructor.Vector.sub(other.pos, this.pos)
    const distanceMag = distanceVect.mag()
    const minDistance = this.radius + other.radius

    if (distanceMag < minDistance) {
      const distanceCorrection = (minDistance - distanceMag) / 2.0
      const d = distanceVect.copy()
      const correctionVector = d.normalize().mult(distanceCorrection)
      other.pos.add(correctionVector)
      this.pos.sub(correctionVector)

      const theta = distanceVect.heading()
      const sine = this.p5.sin(theta)
      const cosine = this.p5.cos(theta)

      const bTemp = [this.p5.createVector(), this.p5.createVector()]

      bTemp[1].x = cosine * other.vel.x + sine * other.vel.y
      bTemp[1].y = cosine * other.vel.y - sine * other.vel.x
      bTemp[0].x = cosine * this.vel.x + sine * this.vel.y
      bTemp[0].y = cosine * this.vel.y - sine * this.vel.x

      const vTemp = [this.p5.createVector(), this.p5.createVector()]

      vTemp[0].x =
        ((this.mass - other.mass) * bTemp[0].x + 2 * other.mass * bTemp[1].x) /
        (this.mass + other.mass)
      vTemp[0].y = bTemp[0].y

      vTemp[1].x =
        ((other.mass - this.mass) * bTemp[1].x + 2 * this.mass * bTemp[0].x) /
        (this.mass + other.mass)
      vTemp[1].y = bTemp[1].y

      bTemp[0].x = cosine * vTemp[0].x - sine * vTemp[0].y
      bTemp[0].y = cosine * vTemp[0].y + sine * vTemp[0].x
      bTemp[1].x = cosine * vTemp[1].x - sine * vTemp[1].y
      bTemp[1].y = cosine * vTemp[1].y + sine * vTemp[1].x

      this.vel.x = bTemp[0].x
      this.vel.y = bTemp[0].y
      other.vel.x = bTemp[1].x
      other.vel.y = bTemp[1].y
    }
  }

  display() {
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
      const angle = this.p5.TWO_PI / 6
      this.p5.beginShape()
      for (let a = 0; a < this.p5.TWO_PI - angle * 0.5; a += angle) {
        const sx = this.p5.cos(a) * this.radius
        const sy = this.p5.sin(a) * this.radius
        this.p5.vertex(sx, sy)
      }
      this.p5.endShape(this.p5.CLOSE)
    }
    this.p5.pop()
  }

  edges() {
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
  // Removed _theme parameter
  (p5: P5): void => {
    const particles: Particle[] = []
    const numHexagons = 5
    const releaseInterval = 60

    p5.setup = () => {
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

    p5.draw = () => {
      p5.clear() // Use clear() for transparency

      if (p5.frameCount % releaseInterval === 0) {
        particles.forEach(p => {
          if (!p.isTriangle) {
            const releaseAngle = p.angle + p5.PI
            const releasePos = p5
              .createVector(p5.cos(releaseAngle), p5.sin(releaseAngle))
              .mult(p.radius)
              .add(p.pos)
            const newTriangle = new Particle(
              p5,
              releasePos.x,
              releasePos.y,
              true,
              p.color
            )
            newTriangle.vel = p5.constructor.Vector.sub(releasePos, p.pos)
              .normalize()
              .mult(4)
            particles.push(newTriangle)
          }
        })
      }

      while (particles.length > 150) {
        const oldestTriangleIndex = particles.findIndex(p => p.isTriangle)
        if (oldestTriangleIndex !== -1) {
          particles.splice(oldestTriangleIndex, 1)
        } else {
          break
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

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      p5.setup()
    }
  }

export default sketch
