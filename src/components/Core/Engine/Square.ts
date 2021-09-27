import P5, { Vector } from 'p5'
import Line from 'src/components/Core/Engine/Line'

export default class Rect extends Line {
  start: Vector
  end: Vector
  stroke = 'black'
  strokeWeight = 1

  constructor(
    start: Vector,
    end: Vector,
    stroke: 'string',
    strokeWeight: number
  ) {
    super(start, end, stroke, strokeWeight)
    this.start = start
    this.end = end
    this.stroke = stroke
    this.strokeWeight = strokeWeight
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
