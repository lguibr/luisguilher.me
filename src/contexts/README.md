
This directory contains React Context providers responsible for managing global application state.

## Contexts

-   **`FileContext.tsx`**:
    -   **Purpose**: Manages the state of all files (resume data and fetched repository files). This includes their content, modified content (`newContent`), diff status, associated images, and the hierarchical tree structure (`treeFiles`).
    -   **State**: `files` (flat array), `treeFiles` (nested structure), `diffFiles` (filtered array of changed files), `focusedFile`, `focusedFileView`.
    -   **Actions**: Provided via `useReducer` (`fileReducer`) for setting content, images, new content, and replacing the entire file set. Also includes functions to find files within the tree.
    -   **Related**: [Reducers README](../reducers/README.md), [useTree Hook README](../hooks/README.md)
-   **`FileViewContext.tsx`**:
    -   **Purpose**: Manages the state and structure of the editor panes (file views). This allows for multiple, splittable views, each with its own set of opened files and a currently active file.
    -   **State**: A tree structure where each node represents a view pane (`FileViewsContextType`) containing `openedFiles`, `currentFile`, `orientation` (for splitting), `id`, and `children` (representing nested splits).
    -   **Actions**: Functions to `openFile`, `closeFile`, `setCurrentFile`, `createChild` (split view), `removeNode`, `setOrientation`, `findNodeById`.
    -   **Note**: Implements a binary tree structure to manage view layouts. Includes logic for rebalancing the tree when views are closed.
-   **`GuideTourContext.tsx`**:
    -   **Purpose**: Manages the state of the interactive welcome tour (`reactour`).
    -   **State**: `steps` (tour configuration), `isTourOpen` (boolean).
    -   **Actions**: `setTour` function to start/stop the tour and persist the state to `localStorage`.
-   **`LoadingContext.tsx`**:
    -   **Purpose**: Manages the global loading state, primarily used to display canvas animations during operations like fetching file content.
    -   **State**: `loading` (boolean), `index` (optional index of sketch to display).
    -   **Actions**: `setLoading`, `flashLoading` (shows loading animation for a specified duration).
-   **`PrintContext.tsx`**:
    -   **Purpose**: Provides functionality for printing the resume using `react-to-print`.
    -   **Exports**: `Printable` (the component to be printed, defined in `Core/Printable`), `print` (the function to trigger printing).
-   **`SideBarContext.tsx`**:
    -   **Purpose**: Manages the state of the main sidebar (visibility and selected section).
    -   **State**: `open` (boolean), `selectedSection` (e.g., 'files', 'search').
    -   **Actions**: `setOpen`, `setSelectedSection`.
-   **`ThemeContext.tsx`**:
    -   **Purpose**: Manages the application's color theme (light/dark).
    -   **State**: `selectedTheme` ('light' | 'vs-dark').
    -   **Actions**: `toggleTheme` function to switch themes and persist the choice to `localStorage`.
    -   **Related**: [Styles README](../styles/README.md)

## Usage

Components typically consume context values using the corresponding custom hooks (e.g., `useContextFile`, `useContextTheme`) defined in `src/hooks/`.

## Related READMEs

-   [Hooks README](../hooks/README.md)
-   [Reducers README](../reducers/README.md)
-   [Root README](../../README.md)