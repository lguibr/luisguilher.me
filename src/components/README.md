
This directory contains all the React components used in the application.

## Structure

Components are organized into two main subdirectories:

-   **`Core/`**: Contains highly reusable, generic components that form the building blocks of the UI and application logic. These components are designed to be independent of specific application features. See the [Core Components README](./Core/README.md) for more details.
-   **`Home/`**: Contains components specifically related to the main "IDE" layout and features of the `luisguilher.me` page. These components often orchestrate multiple `Core` components and interact heavily with the application's contexts and state. Examples include `SideBar`, `FileView`, `TopBar`, `Footer`, etc.

## Naming Conventions

-   Component directories are typically named using PascalCase (e.g., `FileView`).
-   The main component file within a directory is usually `index.tsx`.
-   Styled components specific to a component are often placed in `styled.ts`.

## Related READMEs

-   [Core Components README](./Core/README.md)
-   [Root README](../../README.md)