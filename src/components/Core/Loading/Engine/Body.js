import Calculator from './Calculator'

const calculator = new Calculator()

export default class Body {
  constructor(coordinates, velocity, acceleration, mass) {
    this.coordinates = coordinates
    this.velocity = velocity
    this.acceleration = acceleration
    this.mass = mass
  }

  randomNum = calculator.randomInteger(50, 220)

  color = [this.randomNum, this.randomNum, this.randomNum]

  printProperties() {
    console.log('coordinates:', this.coordinates)
    console.log('velocity:', this.velocity)
    console.log('acceleration:', this.acceleration)
  }

  update(gravity) {
    this.applyAcceleration(gravity)
  }

  applyAcceleration(acceleration = this.acceleration) {
    this.acceleration = acceleration
    this.updateVelocity()
  }

  updateVelocity(acceleration = this.acceleration) {
    this.velocity = calculator.sumVector(this.velocity, acceleration)
    this.UpdateCoordinates()
  }

  UpdateCoordinates(velocity = this.velocity) {
    this.coordinates = calculator.sumVector(this.coordinates, velocity)
  }

  draw(p5) {
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
