
This directory contains various P5.js sketches used for animations within the application, primarily for loading indicators and the "Extensions" demonstration panel.

## Structure

-   **`index.ts`**: Exports an array of all available sketch *factories* and a `sketchs` array containing metadata (name, description, icon) for each sketch, used by the UI (e.g., Extensions panel).
-   **Individual Sketch Directories (e.g., `Bouncing/`, `SnowFlakes/`)**: Each directory typically contains an `index.ts` file that defines and exports a single sketch factory function.

## Sketch Factory

Each sketch is defined as a *factory function* that takes the current theme object as an argument and returns the actual P5.js sketch function. This allows sketches to adapt their appearance (e.g., colors) based on the selected theme.

The signature is:
`(theme: Theme) => (p5: P5) => void`

The inner function `(p5: P5) => void` is the standard P5.js instance mode setup, containing `setup` and `draw` methods.

## Available Sketches

-   **Bouncing**: Multiple particles bouncing off the canvas edges.
-   **LinearConservation**: A single particle bouncing with gravity, demonstrating basic physics.
-   **RandomWalker**: A single particle moving randomly.
-   **SnowFlakes**: Particles simulating falling snowflakes.

## Adding New Sketches

1.  Create a new directory (e.g., `MyNewSketch/`).
2.  Inside, create `index.ts`.
3.  Define your sketch factory function following the signature `(theme: Theme) => (p5: P5) => void`. Use the `theme` object to access colors if needed. Import `Body` and `Calculator` from `../Engine` if physics simulation is required.
4.  Export the factory function as default from `MyNewSketch/index.ts`.
5.  Import the new sketch factory into `src/components/Core/Sketchs/index.ts`.
6.  Add the new factory to the default export array.
7.  Add metadata (name, description, icon path) for the new sketch to the `sketchs` array in `src/components/Core/Sketchs/index.ts`.

## Usage

Sketches are typically rendered using the `Canvas` component (`src/components/Core/Canvas/index.tsx`), which handles the P5.js instance creation and resizing. The `Loading` component and the `Extensions` panel in the `SideBar` are primary consumers.

## Related READMEs

-   [Core Components README](../README.md)
-   [Engine README](../Engine/README.md)
-   [Root README](../../../../README.md)