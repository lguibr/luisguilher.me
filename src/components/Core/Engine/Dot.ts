import P5, { Vector } from 'p5'

export default class Dot extends Vector {
  coordinates: Vector
  stroke: string
  constructor(coordinates: Vector, stroke: string) {
    super()
    this.coordinates = coordinates
    this.stroke = stroke || 'black'
  }

  updateCoordinates(newCoordinates: Vector): void {
    this.coordinates = newCoordinates
  }

  updateStroke(newStroke: string): void {
    this.stroke = newStroke
  }

  draw(p5: P5): void {
    p5.stroke(this.stroke)
    p5.ellipse(this.coordinates.x, this.coordinates.y, 1, 1)
  }
}
