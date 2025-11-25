# File: src/components/Core/README.md
# src/components/Core/README.md

This directory houses the core, reusable React components of the application. These components are designed to be generic building blocks, independent of the specific features of the main "Home" view.

## Key Components

- **`AnimationOverlay/`**: Renders a specific P5.js sketch dynamically in a modal-like overlay. It takes a `sketchName` prop, manually imports the corresponding sketch factory, dynamically loads P5.js, and manages the P5 instance lifecycle and cleanup. Triggered on demand (e.g., by Loading, Extensions panel, Debug button).
- **`Canvas/`**: Renders P5.js sketches directly within the component tree (embedding). See the [Sketches README](./Sketchs/README.md) and [Engine README](./Engine/README.md).
- **`DiffEditor/`**: A wrapper around Monaco Editor's diff view, used for showing changes in the Source Control panel.
- **`DragDrop/`**: Provides a container that detects drag-and-drop events and highlights drop zones (top, bottom, left, right, center), used for arranging file views.
- **`Editor/`**: A wrapper around the standard Monaco Editor, used for displaying and editing file content.
- **`Engine/`**: A simple 2D physics engine used by some P5.js sketches. See the [Engine README](./Engine/README.md).
- **`FloatMenu/`**: A component that displays a pop-up menu relative to its children (used for settings/profile icons in the NavBar).
- **`FloatingWindow/`**: A draggable window component (currently unused but available).
- **`GuideTour/`**: Components related to the `reactour` welcome guide steps.
- **`Icons/`**: A simple component to render SVG icons.
- **`InputText/`**: A basic styled text input component.
- **`Loading/`**: Displays loading animations using the `AnimationOverlay` component (defaults to "Bouncing" sketch).
- **`MarkdownPreview/`**: Renders Markdown content as HTML, including support for Mermaid diagrams. Used for `.md` files.
- **`Modal/`**: A generic modal component with a background overlay.
- **`P5Preloader/`**: A simple, invisible component that triggers the dynamic `import('p5')` on client-side mount to preload the library.
- **`Printable/`**: A component containing the resume content formatted specifically for printing via `react-to-print`.
- **`Shell/`**: A top-level component that applies the selected theme using `ThemeProvider`.
- **`Sketchs/`**: Contains the P5.js animation sketches. See the [Sketches README](./Sketchs/README.md).
- **`Splittable/`**: Uses `react-resizable-panels` to create splittable container views (horizontal or vertical).
- **`Text/`**: A flexible text component based on `styled-components` for consistent typography.
- **`TileFile/`**: Renders a single file/folder entry, typically used in file explorers or navigation tabs, showing icons and names.

## Related READMEs

- [Components README](../README.md)
- [Engine README](./Engine/README.md)
- [Sketches README](./Sketchs/README.md)
- [Root README](../../../README.md)