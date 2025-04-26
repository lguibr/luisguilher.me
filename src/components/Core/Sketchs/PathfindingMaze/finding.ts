// src/components/Core/Sketchs/PathfindingMaze/finding.ts
import type P5 from 'p5'
import type { Spot } from './Spot'
import { heuristic } from './utils'

interface StepFindingResult {
  status: 'searching' | 'found' | 'stuck'
  processedNode: Spot | undefined // The node just moved to closedSet
}

/**
 * Performs one step of the A* pathfinding algorithm.
 * Returns the status and the node processed in this step.
 */
export function stepFinding(
  // _p5: P5, // Parameter 'p5' is declared but its value is never read. Prefix or remove.
  openSet: Spot[],
  closedSet: Spot[],
  // _start: Spot, // Parameter 'start' is declared but its value is never read. Prefix or remove.
  end: Spot
): StepFindingResult {
  if (openSet.length === 0) {
    return { status: 'stuck', processedNode: undefined }
  }

  let winnerIndex = 0
  for (let i = 1; i < openSet.length; i++) {
    if (openSet[i].f < openSet[winnerIndex].f) {
      winnerIndex = i
    } else if (
      openSet[i].f === openSet[winnerIndex].f &&
      openSet[i].h < openSet[winnerIndex].h
    ) {
      // Tie-breaking: prefer lower heuristic cost
      winnerIndex = i
    }
  }

  const current = openSet[winnerIndex]

  if (current === end) {
    closedSet.push(current) // Add end node before returning found
    return { status: 'found', processedNode: current }
  }

  openSet.splice(winnerIndex, 1)
  closedSet.push(current)

  for (const neighbor of current.neighbors) {
    if (closedSet.includes(neighbor) || neighbor.isWall) {
      continue
    }

    const tempG = current.g + 1 // Assuming cost between adjacent nodes is 1
    let newPathFound = false
    if (openSet.includes(neighbor)) {
      if (tempG < neighbor.g) {
        // Found a better path to this neighbor
        neighbor.g = tempG
        newPathFound = true
      }
    } else {
      // First time reaching this neighbor
      neighbor.g = tempG
      openSet.push(neighbor)
      newPathFound = true
    }

    if (newPathFound) {
      neighbor.h = heuristic(neighbor, end)
      neighbor.f = neighbor.g + neighbor.h
      neighbor.previous = current
    }
  }

  return { status: 'searching', processedNode: current } // Return the processed node
}

/**
 * Draws the visual representation of the closed set with low alpha.
 */
export function drawSearchProgress(
  p5: P5,
  // _openSet: Spot[], // Keep openSet param in case you want to draw it later, prefix if unused
  closedSet: Spot[],
  baseColors: P5.Color[], // Use base colors for cycling
  // _cellSize: number, // Parameter 'cellSize' is declared but its value is never read. Prefix or remove.
  // _padding: number, // Parameter 'padding' is declared but its value is never read. Prefix or remove.
  visitedAlpha: number // Pass alpha value
): void {
  // Draw Closed Set (visited nodes) - cycle through baseColors with low alpha
  for (let i = 0; i < closedSet.length; i++) {
    const spot = closedSet[i]
    if (!spot) continue // Safety check

    const baseColor = baseColors[i % baseColors.length]
    if (!baseColor) continue // Safety check

    // Create a new color with the specified alpha
    const lowAlphaColor = p5.color(
      p5.red(baseColor),
      p5.green(baseColor),
      p5.blue(baseColor),
      visitedAlpha // Use the passed alpha
    )
    spot.draw(lowAlphaColor)
  }
}

/**
 * Draws the current head(s) of the A* search process.
 */
export function drawSearchingHead(
  p5: P5,
  searchingHead: Spot, // The node just moved to closedSet
  headColor: P5.Color,
  cellSize: number,
  padding: number
): void {
  const x = searchingHead.i * cellSize + padding
  const y = searchingHead.j * cellSize + padding
  p5.fill(headColor) // Use the smooth transitioning color
  p5.noStroke()
  p5.rect(x, y, cellSize - 2 * padding, cellSize - 2 * padding)
}
