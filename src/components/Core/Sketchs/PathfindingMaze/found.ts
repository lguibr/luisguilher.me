// src/components/Core/Sketchs/PathfindingMaze/found.ts
// src/components/Core/Sketchs/PathfindingMaze/found.ts
import type P5 from 'p5'
import type { Spot } from './Spot'

// reconstructPath remains the same...
export function reconstructPath(endNode: Spot): Spot[] {
  const path: Spot[] = []
  let temp: Spot | null = endNode
  while (temp) {
    path.push(temp)
    temp = temp.previous
  }
  return path.reverse()
}

/**
 * Draws the final path found by A*, cycling through multiple colors for segments.
 */
export function drawFoundPath(
  p5: P5,
  path: Spot[],
  pathColors: P5.Color[], // <<< Accepts the array of P5 colors
  cellSize: number
): void {
  if (path.length === 0 || pathColors.length === 0) return // Need path and colors

  p5.noFill()
  // Use a slightly thicker stroke weight than the maze structure for emphasis
  const pathWeight = cellSize * 0.25 // Adjust factor as needed
  p5.strokeWeight(pathWeight)
  p5.strokeCap(p5.ROUND) // Keep round caps

  // Draw path segments with cycling colors
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i]
    const next = path[i + 1]
    // Cycle through the provided pathColors array
    const color = pathColors[i % pathColors.length]

    p5.stroke(color)
    p5.line(
      current.i * cellSize + cellSize / 2, // Center of current cell
      current.j * cellSize + cellSize / 2,
      next.i * cellSize + cellSize / 2, // Center of next cell
      next.j * cellSize + cellSize / 2
    )
  }

  // Optional: Draw start/end points distinctly on top
  // const startFill = p5.color(0, 255, 0, 200);
  // const endFill = p5.color(255, 0, 0, 200);
  // p5.noStroke(); // Switch to fill for points
  // p5.fill(startFill);
  // p5.ellipse(path[0].i * cellSize + cellSize / 2, path[0].j * cellSize + cellSize / 2, pathWeight);
  // p5.fill(endFill);
  // p5.ellipse(path[path.length - 1].i * cellSize + cellSize / 2, path[path.length - 1].j * cellSize + cellSize / 2, pathWeight);
}
