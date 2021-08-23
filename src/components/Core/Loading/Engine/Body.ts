import Calculator from './Calculator'
import P5 from 'p5'
const calculator = new Calculator()

type Vector = {
  x: number
  y: number
}

export default class Body {
  coordinates: Vector
  velocity: Vector
  acceleration: Vector
  mass: number
  randomNum: number
  color: [number, number, number]
  constructor(
    coordinates: Vector,
    velocity: Vector,
    acceleration: Vector,
    mass: number
  ) {
    this.coordinates = coordinates
    this.velocity = velocity
    this.acceleration = acceleration
    this.mass = mass
    this.randomNum = calculator.randomInteger(50, 220)
    this.color = [this.randomNum, this.randomNum, this.randomNum]
  }

  printProperties(): void {
    console.log('coordinates:', this.coordinates)
    console.log('velocity:', this.velocity)
    console.log('acceleration:', this.acceleration)
  }

  update(gravity: Vector): void {
    this.applyAcceleration(gravity)
  }

  applyAcceleration(acceleration = this.acceleration): void {
    this.acceleration = acceleration
    this.updateVelocity()
  }

  updateVelocity(acceleration = this.acceleration): void {
    this.velocity = calculator.sumVector(this.velocity, acceleration)
    this.UpdateCoordinates()
  }

  UpdateCoordinates(velocity = this.velocity): void {
    this.coordinates = calculator.sumVector(this.coordinates, velocity)
  }

  draw(p5: P5): void {
    p5.fill(p5.color(...this.color))
    p5.stroke('#0000')
    p5.strokeWeight(0)
    p5.ellipse(
      this.coordinates.x,
      this.coordinates.y,
      this.mass * 10,
      this.mass * 10
    )
  }
}
