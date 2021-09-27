import P5, { Vector } from 'p5'

export default class Line extends Vector {
  start: Vector
  end: Vector
  stroke: string
  strokeWeight: number

  constructor(
    start: Vector,
    end: Vector,
    stroke?: 'string',
    strokeWeight?: number
  ) {
    super()
    this.start = start
    this.end = end
    this.stroke = stroke || 'black'
    this.strokeWeight = strokeWeight || 1
  }

  updateStart(newStart: Vector): void {
    this.start = newStart
  }

  updateEnd(newEnd: Vector): void {
    this.end = newEnd
  }

  updateStroke(newStroke: string): void {
    this.stroke = newStroke
  }

  updateStrokeWeight(newStrokeWeight: number): void {
    this.strokeWeight = newStrokeWeight
  }

  draw(p5: P5): void {
    p5.stroke(this.stroke)
    p5.strokeWeight(this.strokeWeight)
    p5.line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}
