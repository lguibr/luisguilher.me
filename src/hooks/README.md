
This directory contains custom React hooks used throughout the application to encapsulate reusable logic and stateful interactions, often related to consuming contexts or handling specific browser/API features.

## Hooks

-   **`useContextFile.ts`**: Provides access to the `FileContext`. Returns file state (`files`, `treeFiles`, `diffFiles`), focus state (`focusedFile`, `focusedFileView`), and actions (`setContent`, `setImage`, `setNewContent`, `setFiles`, `findTreeFile`, `setFocusedFile`, `setFocusedFileView`).
-   **`useContextFileView.ts`**: Provides access to the `FileViewsContext`. Returns the current view state/tree (`openedFiles`, `currentFile`, `orientation`, `id`, `children`, `fileViewsTree`) and actions (`openFile`, `closeFile`, `setCurrentFile`, `findNodeById`, `createChild`, `removeNode`, `getRootId`, `setOrientation`).
-   **`useContextPrint.ts`**: Provides access to the `PrintContext`. Returns the `Printable` component and the `print` function.
-   **`useContextTheme.ts`**: Provides access to the `ThemeContext`. Returns the `selectedTheme` and the `toggleTheme` function.
-   **`useExtension.ts`**: Provides utility functions related to file extensions and icons:
    -   `extractIcon`: Determines the appropriate file/folder icon based on the file path, name, and folder status.
    -   `extractExtension`: Determines the language mode (e.g., 'typescript', 'json') for the Monaco editor based on the file extension.
-   **`useGuideTour.ts`**: Provides access to the `GuideTourContext`. Returns the tour `steps`, `isTourOpen` state, and the `setTour` function.
-   **`useLoading.ts`**: Provides access to the `LoadingContext`. Returns the `loading` state, optional sketch `index`, and actions (`setLoading`, `flashLoading`).
-   **`useSideBar.ts`**: Provides access to the `SideBarContext`. Returns the `open` state, `selectedSection`, and actions (`setOpen`, `setSelectedSection`).
-   **`useTree.ts`**: Provides utility functions for working with file tree structures:
    -   `build`: Constructs a nested tree structure from a flat list of file paths (typically from the GitHub API).
    -   `rebuildPaths`: Takes a list of files (often diff files) and ensures all parent directory paths exist in the list, necessary for building a tree from sparse paths.
    -   `flatTree`: Flattens a nested tree structure back into a flat array of files.
-   **`useWindow.ts`**: Provides information about the browser window size and derived breakpoints (e.g., `isMedium`, `isSmall`). Listens for resize events.

## Usage

Import the desired hook into your component and call it to access its state and functions. Example: `const { files, setContent } = useContextFile();`

## Related READMEs

-   [Contexts README](../contexts/README.md)
-   [Root README](../../README.md)