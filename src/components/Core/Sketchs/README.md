This directory contains various P5.js sketches used for animations within the application, primarily for loading indicators and the "Extensions" demonstration panel.

## Structure

- **`index.ts`**: Exports a `SketchFactory` type definition. Sketch metadata is now managed in `src/assets/sketchMetadata.ts`.
- **Individual Sketch Directories (e.g., `DoublePendulum/`)**: Each directory typically contains an `index.ts` file that defines and exports a single sketch factory function.

## Sketch Factory

Each sketch is defined as a _factory function_ that takes the current theme object as an argument and returns the actual P5.js sketch function. This allows sketches to adapt their appearance (e.g., colors) based on the selected theme.

The signature is:
`(theme: Theme) => (p5: P5) => void`

The inner function `(p5: P5) => void` is the standard P5.js instance mode setup, containing `setup` and `draw` methods.

## Available Sketches (Exposed via Extensions Panel)

- **DoublePendulum**: Simulates the chaotic motion of a double pendulum with a velocity-based colored trail.
- **HexagonCollision**: Features spinning hexagons releasing triangles that undergo elastic collisions.
- **Starfield**: Creates a visual effect simulating high-speed travel through space using Google colors.
- **PathfindingMaze**: Generates a random maze and visualizes the A\* pathfinding algorithm finding a route.
- **Hypercube**: Renders a rotating 4-dimensional hypercube (tesseract) projected into 3D/2D space.
- **GoogleFlowField**: Particles follow paths defined by a Perlin noise field, colored using the Google palette.
- **BoidsSimulation**: Simulates flocking behavior (separation, alignment, cohesion) among agents (boids) using Google colors.
- **GameOfLife**: Implements Conway's Game of Life cellular automaton using Google colors.
- **Metaballs**: Creates an organic, "gooey" visual effect where circular shapes merge smoothly, using Google colors.
- **FourierDrawing**: Visualizes Fourier series by drawing complex shapes using rotating vectors (epicycles).

_(Note: A random sketch from the available list is used for the loading animation)._

## Adding New Sketches

1.  Create a new directory (e.g., `MyNewSketch/`).
2.  Inside, create `index.ts`.
3.  Define your sketch factory function following the signature `(theme: Theme) => (p5: P5) => void`. Use the `theme` object to access colors if needed. Import `Body` and `Calculator` from `../Engine` if physics simulation is required.
4.  Export the factory function as default from `MyNewSketch/index.ts`.
5.  Import the new sketch factory into `src/components/Core/AnimationOverlay/factoryMap.ts` and add it to the `sketchFactoryMap`.
6.  Add metadata (name, description, icon path) for the new sketch to the `sketchs` array in `src/assets/sketchMetadata.ts`. Remember to create a corresponding icon in `public/icons/`.

## Usage

Sketches are primarily rendered using the `AnimationOverlay` component (`src/components/Core/AnimationOverlay/index.tsx`), which handles dynamic loading, P5.js instance creation, display in a modal, and cleanup. The `Loading` component and the `Extensions` panel in the `SideBar` trigger the `AnimationOverlay`. The `Canvas` component (`src/components/Core/Canvas/index.tsx`) can still be used for embedding sketches directly within other components if needed.

## Related READMEs

- [Core Components README](../README.md)
- [Engine README](../Engine/README.md)
- [Root README](../../../../README.md)
