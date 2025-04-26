// Removed: import type P5 from 'p5'; // No longer needed here

type Vector = {
  x: number
  y: number
}

export default class Calculator {
  transformHEXOnRGB(string: string): [r: number, g: number, b: number] {
    const hex = string.replace('#', '')
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255 || 0
    const g = (bigint >> 8) & 255 || 0
    const b = bigint & 255 || 0
    return [r, g, b]
  }

  sumVector(vector1: Vector, vector2: Vector): Vector {
    const vector1Entries = Object.entries(vector1)
    const vector2Entries = Object.entries(vector2)

    const [vectorLargeDimensionEntries, vectorSmallerDimensionEntries] =
      vector1Entries.length <= vector2Entries.length
        ? [vector1Entries, vector2Entries]
        : [vector2Entries, vector1Entries]

    const sumOfEntries = vectorLargeDimensionEntries.map(
      ([keyFromLarger, valueFromLarger]) => {
        const currentMatch = vectorSmallerDimensionEntries.find(
          ([keyFromSmaller]) => keyFromSmaller === keyFromLarger
        )
        const currentMatchValue =
          currentMatch && currentMatch[1] ? currentMatch[1] : 0
        return [keyFromLarger, valueFromLarger + currentMatchValue]
      }
    )

    return Object.fromEntries(sumOfEntries)
  }

  divideVectorByNumber(vector1: Vector, number: number): Vector {
    const vectorEntries = Object.entries(vector1)
    const vectorDivided = vectorEntries.map(([key, value]) => [
      key,
      value / number
    ])
    return Object.fromEntries(vectorDivided)
  }

  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  createRandomVector(vectorBluePrint: Array<[number, number]>): Vector {
    const [xTemplate, yTemplate] = vectorBluePrint
    return {
      x: this.randomInteger(...xTemplate),
      y: this.randomInteger(...yTemplate)
    }
  }
}
