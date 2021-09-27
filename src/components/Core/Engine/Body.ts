import Calculator from './Calculator'
import P5, { Vector } from 'p5'

const calc = Calculator()

// const p5 = new P5(() => ({}))

export default class Body {
  coordinates: Vector
  velocity: Vector
  acceleration: Vector
  mass: number
  stroke?: number
  randomNum: number
  color: [number, number, number, number?]
  constructor(
    coordinates: Vector,
    velocity: Vector,
    acceleration: Vector,
    mass: number,
    color?: string
  ) {
    this.coordinates = coordinates
    this.velocity = velocity
    this.acceleration = acceleration
    this.mass = mass
    this.randomNum = calc.randomInteger(50, 220)
    this.color = color
      ? calc.transformHEXOnRGB(color)
      : [this.randomNum, this.randomNum, this.randomNum]
  }

  printProperties(): void {
    console.log('coordinates:', this.coordinates)
    console.log('velocity:', this.velocity)
    console.log('acceleration:', this.acceleration)
  }

  update(externalAcceleration: Vector): void {
    this.acceleration = externalAcceleration
    this.updateCoordinates()
    this.updateVelocity()
  }

  // NOTE v=v0*at => v1 =  v0+a
  updateVelocity(acceleration = this.acceleration): void {
    this.velocity = calc.sumVector(this.velocity, acceleration)
  }

  // NOTE d=d0+v0t+1/2at² => d1 =d0+v0*1+a/2*1² => d1 = d0+v0+a/2
  updateCoordinates(velocity = this.velocity): void {
    const halfAcceleration = calc.divideVectorByNumber(this.acceleration, 2)
    const newAccumulator = calc.sumVector(halfAcceleration, velocity)
    this.coordinates = calc.sumVector(this.coordinates, newAccumulator)
  }

  draw(p5: P5): void {
    p5.fill(p5.color(...this.color))
    p5.strokeWeight(0)
    p5.ellipse(
      this.coordinates.x,
      this.coordinates.y,
      this.mass * 10,
      this.mass * 10
    )
  }
}
