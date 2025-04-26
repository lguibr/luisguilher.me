// src/assets/sketchMetadata.ts
import { sketchs as sketchFactories } from 'src/components/Core/AnimationOverlay/factoryMap' // Import the map

// Filter metadata based on available factories
export const sketchs = [
  // Removed SnowFlakes entry
  {
    name: 'DoublePendulum',
    description:
      'Simulates the chaotic motion of a double pendulum with trace.',
    icon: '/icons/pendulum.png'
  },
  {
    name: 'HexagonCollision',
    description:
      'Spinning hexagons release triangles that collide elastically.',
    icon: '/icons/hexagon.png'
  },
  {
    name: 'Starfield',
    description:
      'Simulates a starfield effect like hyperspace travel using Google colors.',
    icon: '/icons/starfield.png'
  },
  {
    name: 'PathfindingMaze',
    description: 'Visualizes the A* pathfinding algorithm in a random maze.',
    icon: '/icons/maze.png'
  },
  {
    name: 'Hypercube',
    description: 'Renders a rotating 4D hypercube (tesseract) in 3D space.',
    icon: '/icons/hypercube.png'
  },
  {
    name: 'GoogleFlowField',
    description:
      'Particles moving along a Perlin noise flow field using Google colors.',
    icon: '/icons/flowfield.png'
  },
  {
    name: 'BoidsSimulation',
    description: 'Simulates flocking behavior (boids) using Google colors.',
    icon: '/icons/boids.png'
  },
  {
    name: 'GameOfLife',
    description: "Conway's Game of Life simulation with Google colors.",
    icon: '/icons/gol.png'
  },
  {
    name: 'Metaballs',
    description: 'Generates a gooey metaball effect using Google colors.',
    icon: '/icons/metaballs.png'
  },
  {
    name: 'FourierDrawing',
    description: 'Draws shapes using epicycles based on Fourier series.',
    icon: '/icons/fourier.png'
  }
].filter(meta => sketchFactories[meta.name]) // Ensure only available sketches are listed

export default sketchs
