// File: src/components/Core/Sketchs/PathfindingMaze/utils.ts
import type { Spot } from './Spot'

// Manhattan distance heuristic
export function heuristic(a: Spot, b: Spot): number {
  return Math.abs(a.i - b.i) + Math.abs(a.j - b.j)
}
