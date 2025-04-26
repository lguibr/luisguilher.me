// src/components/Core/Sketchs/PathfindingMaze/Spot.ts
import type P5 from 'p5'
import type { Cell } from './Cell'

export class Spot {
  p5: P5
  i: number // Column index
  j: number // Row index
  f = 0 // Total estimated cost (g + h)
  g = 0 // Cost from start to this node
  h = 0 // Heuristic cost from this node to end
  neighbors: Spot[] = []
  previous: Spot | null = null
  isWall = false
  size: number
  padding: number

  constructor(p5: P5, i: number, j: number, size: number, padding: number) {
    this.p5 = p5
    this.i = i
    this.j = j
    this.size = size
    this.padding = padding
  }

  addNeighbors(spotGrid: Spot[][], mazeGrid: Cell[][]): void {
    const { i, j } = this
    const cols = spotGrid.length
    const rows = spotGrid[0]?.length ?? 0
    const currentMazeCell = mazeGrid[i]?.[j]
    if (!currentMazeCell) return

    if (j > 0 && !currentMazeCell.walls.top) {
      this.neighbors.push(spotGrid[i][j - 1])
    }
    if (i < cols - 1 && !currentMazeCell.walls.right) {
      this.neighbors.push(spotGrid[i + 1][j])
    }
    if (j < rows - 1 && !currentMazeCell.walls.bottom) {
      this.neighbors.push(spotGrid[i][j + 1])
    }
    if (i > 0 && !currentMazeCell.walls.left) {
      this.neighbors.push(spotGrid[i - 1][j])
    }
  }

  // Draw this spot with a specific color
  draw(color: P5.Color): void {
    // Explicitly type as P5.Color
    const { p5, i, j, size, padding } = this
    const x = i * size + padding
    const y = j * size + padding
    p5.fill(color) // p5.fill expects P5.Color or number/string args
    p5.noStroke()
    p5.rect(x, y, size - 2 * padding, size - 2 * padding)
  }
}
