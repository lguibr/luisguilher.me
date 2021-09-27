import P5, { Vector } from 'p5'
import Dot from 'src/components/Core/Engine/Dot'

export default class Ball extends Dot {
  coordinates: Vector
  stroke = 'black'
  strokeWeight = 1
  radius = 1
  color = 'white'

  constructor(dot: Dot, strokeWeight: number, radius: number, color: string) {
    super(dot.coordinates, dot?.stroke)
    this.coordinates = dot.coordinates
    this.stroke = dot.stroke
    this.radius = radius
    this.color = color
    this.strokeWeight = strokeWeight
  }

  updateStrokeWeight(newStrokeWeight: number): void {
    this.strokeWeight = newStrokeWeight
  }

  updateRadius(newRadius: number): void {
    this.radius = newRadius
  }

  updateColor(newColor: string): void {
    this.color = newColor
  }

  draw(p5: P5): void {
    p5.stroke(this.stroke)
    p5.strokeWeight(this.strokeWeight)
    p5.circle(this.coordinates.x, this.coordinates.y, this.radius)
  }
}
