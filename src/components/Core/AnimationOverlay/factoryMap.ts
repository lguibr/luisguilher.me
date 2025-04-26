// src/components/Core/AnimationOverlay/factoryMap.ts
import type { SketchFactory } from 'src/components/Core/Sketchs' // Keep type import

// --- Manual Imports for Sketch Factories ---
import DoublePendulumSketch from 'src/components/Core/Sketchs/DoublePendulum'
import HexagonCollisionSketch from 'src/components/Core/Sketchs/HexagonCollision'
import StarfieldSketch from 'src/components/Core/Sketchs/Starfield'
import PathfindingMazeSketch from 'src/components/Core/Sketchs/PathfindingMaze'
import HypercubeSketch from 'src/components/Core/Sketchs/Hypercube'
// Updated import path
import NoiseFlowFieldSketch from 'src/components/Core/Sketchs/NoiseFlowField'
import BoidsSimulationSketch from 'src/components/Core/Sketchs/BoidsSimulation'
import GameOfLifeSketch from 'src/components/Core/Sketchs/GameOfLife'
import MetaballsSketch from 'src/components/Core/Sketchs/Metaballs'
import FourierDrawingSketch from 'src/components/Core/Sketchs/FourierDrawing'
// --- End Manual Imports ---

// --- Map Sketch Names to Imported Factories ---
export const sketchFactoryMap: { [key: string]: SketchFactory } = {
  DoublePendulum: DoublePendulumSketch,
  HexagonCollision: HexagonCollisionSketch,
  Starfield: StarfieldSketch,
  PathfindingMaze: PathfindingMazeSketch,
  Hypercube: HypercubeSketch,
  // Updated key and value
  NoiseFlowField: NoiseFlowFieldSketch,
  BoidsSimulation: BoidsSimulationSketch,
  GameOfLife: GameOfLifeSketch,
  Metaballs: MetaballsSketch,
  FourierDrawing: FourierDrawingSketch
}

// Also export the map as 'sketchs' for compatibility if needed elsewhere, though 'sketchFactoryMap' is more descriptive
export const sketchs = sketchFactoryMap
// --- End Map ---
