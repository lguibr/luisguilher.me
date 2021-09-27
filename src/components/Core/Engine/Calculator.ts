import P5, { Vector } from 'p5'

const p5 = new P5(() => ({}))

const Calculator = () => ({
  transformHEXOnRGB(string: string): [r: number, g: number, b: number] {
    const hex = string.replace('#', '')
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255 || 0
    const g = (bigint >> 8) & 255 || 0
    const b = bigint & 255 || 0
    return [r, g, b]
  },
  sumVector(vector1: Vector, vector2: Vector): Vector {
    const vector = vector1.copy()
    return vector.add(vector2)
  },

  divideVectorByNumber(vector1: Vector, number: number): Vector {
    const vector = vector1.copy()
    return vector.div(number)
  },

  randomInteger(min: number, max: number): number {
    return p5.random(min, max)
  },

  createRandomVector(vectorBluePrint: Array<[number, number]>): Vector {
    const minsMaxs = vectorBluePrint.map(([min, max]) => p5.random(min, max))
    return p5.createVector(...minsMaxs)
  }
})

export default Calculator
