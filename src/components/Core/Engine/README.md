
This directory contains a very simple 2D physics engine used by some of the P5.js sketches (see [Sketches README](../Sketchs/README.md)).

## Components

-   **`Body.ts`**: Represents a physical body (like a particle or circle) with properties:
    -   `coordinates`: Position vector {x, y}.
    -   `velocity`: Velocity vector {x, y}.
    -   `acceleration`: Acceleration vector {x, y}.
    -   `mass`: Scalar mass.
    -   `color`: RGB(A) color array.
    -   Methods for updating position based on velocity and acceleration (`update`, `applyAcceleration`, `updateVelocity`, `UpdateCoordinates`) and drawing the body (`draw`).
-   **`Calculator.ts`**: Provides utility functions for vector math and other calculations needed by the engine and sketches:
    -   `transformHEXOnRGB`: Converts hex color strings to RGB arrays.
    -   `sumVector`: Adds two vectors.
    -   `divideVectorByNumber`: Divides a vector by a scalar.
    -   `randomInteger`: Generates a random integer within a range.
    -   `createRandomVector`: Creates a vector with random components based on provided ranges.

## Usage

Sketches typically import `Body` and `Calculator` to create and manage multiple `Body` instances, update their states in each frame, and draw them on the P5 canvas.

## Related READMEs

-   [Core Components README](../README.md)
-   [Sketches README](../Sketchs/README.md)
-   [Root README](../../../../README.md)