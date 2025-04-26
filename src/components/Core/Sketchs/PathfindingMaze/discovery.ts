// src/components/Core/Sketchs/PathfindingMaze/discovery.ts
import type P5 from 'p5' // Keep type import if needed elsewhere, though not directly used here
import type { Cell } from './Cell'

// Performs one step of the Depth-First Search maze carving algorithm.
export function stepCarveMaze(
  // _p5: P5, // Parameter 'p5' is declared but its value is never read. Prefix with _ or remove.
  currentCell: Cell | undefined,
  mazeGrid: Cell[][],
  stack: Cell[]
): boolean {
  if (!currentCell) return true // Should have finished if currentCell is undefined

  const next = currentCell.checkNeighbors(mazeGrid)
  if (next) {
    next.visited = true
    stack.push(next) // Push the next cell onto the stack
    currentCell.removeWalls(next)
    // currentCell remains the one we just came from until we backtrack
    return false // Still carving
  } else if (stack.length > 1) {
    // Ensure we don't pop the last element if it has no neighbors
    stack.pop() // Backtrack: remove current from stack
    // The new currentCell will be the one now at the top of the stack (handled in index.ts)
    return false // Still carving (backtracking)
  } else {
    // Stack has only the start cell left, or became empty unexpectedly
    return true // Carving finished
  }
}

// Draws a "fog of war" overlay, revealing visited cells (Optional).
export function drawDiscoveryOverlay(
  p5: P5,
  mazeGrid: Cell[][],
  discoveryColor: P5.Color,
  cellSize: number
): void {
  p5.noStroke()
  p5.fill(discoveryColor) // Semi-transparent color for unvisited cells

  const cols = mazeGrid.length
  const rows = mazeGrid[0]?.length ?? 0

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (mazeGrid[i]?.[j] && !mazeGrid[i][j].visited) {
        p5.rect(i * cellSize, j * cellSize, cellSize, cellSize)
      }
    }
  }
}

/**
 * Draws the current head of the maze carving process.
 */
export function drawCarvingHead(
  p5: P5,
  currentCell: Cell,
  headColor: P5.Color,
  cellSize: number,
  padding: number // Use padding to draw inside cell bounds
): void {
  // Calculate position and size respecting padding
  const x = currentCell.i * cellSize + padding
  const y = currentCell.j * cellSize + padding
  const w = cellSize - 2 * padding
  const h = cellSize - 2 * padding

  p5.fill(headColor) // Use the smooth transitioning color
  p5.noStroke() // No border for the head itself
  p5.rect(x, y, w, h) // Draw rectangle within padding
}
