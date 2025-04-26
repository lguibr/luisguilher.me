This directory contains reducer functions used with the `useReducer` hook for managing complex state logic, primarily for the `FileContext`.

## Reducers

- **`FileReducer.tsx`**: Manages the state of the `files` array within `FileContext`.
  - **State (`FileType[]`)**: An array where each object represents a file and contains properties like `path`, `name`, `content`, `newContent`, `image`, `diff`, `isDiff`, etc.
  - **Actions (`ActionType`)**: Handles various actions to update the file state:
    - `SET_CURRENT`: Marks a specific file as the currently active one (unused, handled by `FileViewContext`).
    - `CLEAN_CURRENT`: Clears the current file flag (unused).
    - `SET_HIGHLIGHTED`: Marks a file as highlighted (unused, handled by `FileViewContext` or component state).
    - `CLEAN_HIGHLIGHTED`: Clears the highlighted flag (unused).
    - `SET_IMAGE`: Updates the `image` property (JSX element) for a specific file.
    - `SET_CONTENT`: Sets the initial `content` and `newContent` for a file (typically after fetching).
    - `SET_NEW_CONTENT`: Updates the `newContent` of a file and sets the `diff` flag if `newContent` differs from `content`.
    - `SET_FILES`: Replaces the entire state with a new array of files.

## Usage

The `FileReducer` is used within `FileContext.tsx` like this:
`const [files, dispatch] = useReducer(fileReducer, initialState);`

Actions are dispatched from `FileContext`'s exported functions (e.g., `setContent`, `setNewContent`).

## Related READMEs

- [Contexts README](../contexts/README.md)
- [Root README](../../README.md)
