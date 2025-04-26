// src/assets/sketchMetadata.ts
import { sketchs as sketchFactories } from 'src/components/Core/AnimationOverlay/factoryMap' // Import the map

// Filter metadata based on available factories
export const sketchs = [
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
    description: 'Simulates a starfield effect like hyperspace travel ',
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
    // Updated name and description
    name: 'NoiseFlowField',
    description: 'Particles moving along a Perlin noise flow field',
    icon: '/icons/flowfield.png' // Icon name remains the same
  },
  {
    name: 'BoidsSimulation',
    description: 'Simulates flocking behavior (boids)', // Adjusted description
    icon: '/icons/boids.png'
  },
  {
    name: 'GameOfLife',
    description: "Conway's Game of Life simulation", // Adjusted description
    icon: '/icons/gol.png'
  },
  {
    name: 'Metaballs',
    description: 'Generates a gooey metaball effect', // Adjusted description
    icon: '/icons/metaballs.png'
  },
  {
    name: 'FourierDrawing',
    description: 'Draws shapes using epicycles based on Fourier series.',
    icon: '/icons/fourier.png'
  }
].filter(meta => sketchFactories[meta.name]) // Ensure only available sketches are listed

export default sketchs
