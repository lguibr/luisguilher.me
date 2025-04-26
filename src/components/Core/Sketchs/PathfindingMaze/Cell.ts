// src/components/Core/Sketchs/PathfindingMaze/Cell.ts
import type P5 from 'p5'

export class Cell {
  p5: P5
  i: number // Column index
  j: number // Row index
  walls = { top: true, right: true, bottom: true, left: true }
  visited = false
  size: number
  padding: number

  constructor(p5: P5, i: number, j: number, size: number, padding: number) {
    this.p5 = p5
    this.i = i
    this.j = j
    this.size = size
    this.padding = padding
  }

  checkNeighbors(grid: Cell[][]): Cell | undefined {
    const { i, j, p5 } = this
    const neighbors: Cell[] = []
    const top = grid[i]?.[j - 1]
    const right = grid[i + 1]?.[j]
    const bottom = grid[i]?.[j + 1]
    const left = grid[i - 1]?.[j]
    if (top && !top.visited) neighbors.push(top)
    if (right && !right.visited) neighbors.push(right)
    if (bottom && !bottom.visited) neighbors.push(bottom)
    if (left && !left.visited) neighbors.push(left)
    if (neighbors.length > 0) {
      const r = p5.floor(p5.random(0, neighbors.length))
      return neighbors[r]
    } else {
      return undefined
    }
  }

  removeWalls(next: Cell): void {
    const dx = this.i - next.i
    if (dx === 1) {
      this.walls.left = false
      next.walls.right = false
    } else if (dx === -1) {
      this.walls.right = false
      next.walls.left = false
    }
    const dy = this.j - next.j
    if (dy === 1) {
      this.walls.top = false
      next.walls.bottom = false
    } else if (dy === -1) {
      this.walls.bottom = false
      next.walls.top = false
    }
  }

  highlight(color: P5.Color): void {
    // Explicitly type as P5.Color
    const { p5, i, j, size, padding } = this
    const x = i * size + padding
    const y = j * size + padding
    p5.noStroke()
    p5.fill(color) // p5.fill expects P5.Color or number/string args
    p5.rect(x, y, size - 2 * padding, size - 2 * padding)
  }

  drawBorders(wallColor: P5.Color, wallWeightFactor: number): void {
    // Explicitly type as P5.Color
    const { p5, i, j, size } = this
    const x = i * size
    const y = j * size

    p5.stroke(wallColor) // p5.stroke expects P5.Color or number/string args
    p5.strokeWeight(size * wallWeightFactor)

    if (this.walls.top) p5.line(x, y, x + size, y)
    if (this.walls.right) p5.line(x + size, y, x + size, y + size)
    if (this.walls.bottom) p5.line(x + size, y + size, x, y + size)
    if (this.walls.left) p5.line(x, y + size, x, y)
  }
}
