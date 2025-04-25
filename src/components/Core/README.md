
# src/components/Core/README.md

This directory houses the core, reusable React components of the application. These components are designed to be generic building blocks, independent of the specific features of the main "Home" view.

## Key Components

-   **`Canvas/`**: Renders P5.js sketches. See the [Sketches README](./Sketchs/README.md) and [Engine README](./Engine/README.md).
-   **`DiffEditor/`**: A wrapper around Monaco Editor's diff view, used for showing changes in the Source Control panel.
-   **`DragDrop/`**: Provides a container that detects drag-and-drop events and highlights drop zones (top, bottom, left, right, center), used for arranging file views.
-   **`Editor/`**: A wrapper around the standard Monaco Editor, used for displaying and editing file content.
-   **`Engine/`**: A simple 2D physics engine used by some P5.js sketches. See the [Engine README](./Engine/README.md).
-   **`FloatMenu/`**: A component that displays a pop-up menu relative to its children (used for settings/profile icons in the NavBar).
-   **`FloatingWindow/`**: A draggable window component (currently unused but available).
-   **`GuideTour/`**: Components related to the `reactour` welcome guide steps.
-   **`Icons/`**: A simple component to render SVG icons.
-   **`InputText/`**: A basic styled text input component.
-   **`Loading/`**: Displays loading animations, often utilizing the `Canvas` component.
-   **`Modal/`**: A generic modal component with a background overlay.
-   **`Printable/`**: A component containing the resume content formatted specifically for printing via `react-to-print`.
-   **`Shell/`**: A top-level component that applies the selected theme using `ThemeProvider`.
-   **`Sketchs/`**: Contains the P5.js animation sketches. See the [Sketches README](./Sketchs/README.md).
-   **`Splittable/`**: Uses `react-resizable-panels` to create splittable container views (horizontal or vertical).
-   **`Text/`**: A flexible text component based on `styled-components` for consistent typography.
-   **`TileFile/`**: Renders a single file/folder entry, typically used in file explorers or navigation tabs, showing icons and names.

## Related READMEs

-   [Components README](../README.md)
-   [Engine README](./Engine/README.md)
-   [Sketches README](./Sketchs/README.md)
-   [Root README](../../../README.md)