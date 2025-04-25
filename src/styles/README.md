
This directory manages the application's styling, theming, and related type definitions.

## Files

-   **`global.ts`**: Defines global CSS styles using `styled-components`' `createGlobalStyle`. Includes resets, base font settings, and scrollbar styling.
-   **`theme.ts`**: Defines the color palettes and breakpoint values for the different themes ('light', 'vs-dark'). This object is used by the `ThemeProvider` in `src/components/Core/Shell.tsx`.
-   **`styled.d.ts`**: TypeScript declaration file for `styled-components`. It extends the `DefaultTheme` interface to provide type safety and autocompletion when accessing theme properties within styled components (e.g., `theme.colors.text`).

## Approach

-   **Styled Components**: Used for component-level styling, allowing CSS to be co-located with component logic and enabling dynamic styling based on props and theme.
-   **Theming**: `ThemeProvider` wraps the application (`Shell`), providing the selected theme object (`light` or `vs-dark`) to all styled components via the `theme` prop. Theme switching is handled by `ThemeContext`.
-   **Breakpoints**: Defined in `theme.ts` and used within styled components for responsive design via media queries (e.g., `@media (max-width: ${({ theme }) => theme.breakpoints.medium})`). Custom hooks like `useWindowSize` also utilize these breakpoints.

## Usage

-   Styled components access theme variables like: `color: ${({ theme }) => theme.colors.text};`
-   Global styles are applied automatically.
-   Theme switching is managed by `ThemeContext` and `useContextTheme` hook.

## Related READMEs

-   [Contexts README](../contexts/README.md)
-   [Hooks README](../hooks/README.md)
-   [Root README](../../README.md)