
Welcome to [luisguilher.me](https://luisguilher.me), an immersive web experience showcasing my professional portfolio through an interactive interface inspired by the VS Code IDE. This project demonstrates modern front-end development skills and provides a unique way to explore my resume, skills, and projects.

<p align="center">
  <img src="public/favicon.png" alt="AlphaTriangle Logo" width="300"/>
</p>

## Features

-   **VS Code-like Interface**: Offers a familiar and intuitive environment simulating the popular VS Code IDE.
-   **Welcome Tour**: Guides users through the features interactively.
-   **Self-Hosted Source Code**: Allows code exploration directly within the interface, similar to an IDE.
-   **Multiple File Viewing**: Supports opening and working with multiple files simultaneously with a split-screen feature.
-   **Drag and Drop**: Facilitates easy organization of file views within the workspace.
-   **Text Search**: Enables quick searching for text across all open (and modified) files.
-   **Diff Comparison**: Allows users to track changes and view differences between current and original files in the "Source Control" view.
-   **Interactive Canvas Animations**: Adds visual interest during file loading and when interacting with specific UI elements (e.g., Extensions menu).
-   **Extensive Canvas Collection**: Offers a range of animations accessible through the extensions menu.
-   **Print-Ready CV**: Generate a formatted CV using the shortcut `Ctrl+P`.
-   **Theme Customization**: Personalize the interface with light and dark themes (`Ctrl+Q`).

## Technologies Used

-   **Front-end Frameworks/Libraries**: React, Next.js
-   **TypeScript**: Ensures type safety across the project.
-   **Styled Components**: Manages component-level styles and theming. ([See Styling README](./src/styles/README.md))
-   **Monaco Editor**: Provides the core code editor functionality.
-   **P5.js**: Powers the interactive canvas animations. ([See Sketches README](./src/components/Core/Sketchs/README.md))
-   **React Resizable Panels**: Enables splittable view layouts.
-   **Reactour**: Drives the interactive welcome guide.
-   **Deployment**: Hosted on Vercel with Analytics.

## Data Structures & State Management

-   **Tree of Files**: A hierarchical structure representing the file system (both resume data and project source code), managed within `FileContext`. ([See Contexts README](./src/contexts/README.md))
-   **Binary Tree of Views**: Manages the layout and state (opened files, current file) of potentially split editor panes, managed within `FileViewsContext`. ([See Contexts README](./src/contexts/README.md))
-   **React Context API & `useReducer`**: Used extensively for global state management (Files, Views, Theme, Loading, etc.). ([See Contexts README](./src/contexts/README.md), [Reducers README](./src/reducers/README.md))

## Installation

To run `luisguilher.me` locally:

1.  Clone the repository:
    ```bash
    git clone https://github.com/lguibr/luisguilher.me.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd luisguilher.me
    ```
3.  Install dependencies:
    ```bash
    yarn install
    ```
4.  Start the development server:
    ```bash
    yarn dev
    ```

Visit `http://localhost:3000` in your browser.

## Usage Shortcuts

-   **Toggle Theme**: `Ctrl + Q`
-   **Print/Download Resume**: `Ctrl + P`
-   **Restart Tour**: `Ctrl + Shift + 2` (or `Ctrl + @`)
-   **Flash Loading Animation**: `Ctrl + Space`

## Project Structure

```
luisguilher.me/
│
├── public/             # Static assets (icons, images)
│
├── src/
│   ├── assets/         # Static data (contacts, resume sections)
│   ├── components/     # React components ([README](./src/components/README.md))
│   │   ├── Core/       # Reusable UI/logic components ([README](./src/components/Core/README.md))
│   │   └── Home/       # Components specific to the main IDE layout
│   ├── contexts/       # React Context providers ([README](./src/contexts/README.md))
│   ├── hooks/          # Custom React hooks ([README](./src/hooks/README.md))
│   ├── pages/          # Next.js page routes
│   ├── reducers/       # State reducer functions ([README](./src/reducers/README.md))
│   ├── services/       # External API interactions ([README](./src/services/README.md))
│   └── styles/         # Global styles, themes, type definitions ([README](./src/styles/README.md))
│
├── .editorconfig       # Editor configuration
├── .eslintrc.json      # ESLint configuration
├── .gitignore          # Git ignore rules
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── README.md           # This file
├── tsconfig.json       # TypeScript configuration
└── yarn.lock           # Dependency lock file
```

## Contributing

Contributions are welcome!

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing linting rules (`yarn lint`).

## License

This project is open-source under the MIT License.

## Final Note

Thank you for visiting `luisguilher.me`. Explore, interact, and feel free to connect!