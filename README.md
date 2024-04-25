# luisguilher.me

Welcome to [luisguilher.me](https://luisguilher.me), an immersive web experience that showcases my professional portfolio through an interactive interface inspired by the VS Code IDE. This project demonstrates cutting-edge front-end development skills and provides a unique way to explore my resume, skills, and projects.

## Features

- **VS Code-like Interface**: Offers a familiar and intuitive environment that simulates the popular VS Code IDE.
- **Welcome Tour**: Guides users through the features of the project in an interactive manner.
- **Self-Hosted Source Code**: Allows code exploration directly within the interface, functioning similarly to an IDE.
- **Multiple File Viewing**: Supports opening and working with multiple files simultaneously with a split-screen feature.
- **Drag and Drop**: Facilitates easy organization of files within the workspace.
- **Text Search**: Enables quick searching for text across all open files.
- **Diff Comparison**: Allows users to track changes and view differences between current and original files.
- **Interactive Canvas Animations**: Adds visual interest during file loading and when interacting with specific UI elements.
- **Extensive Canvas Collection**: Offers a wide range of animations accessible through the extensions menu.
- **Print-Ready CV**: Users can generate a formatted CV using the shortcut `Ctrl+P`.
- **Theme Customization**: Allows personalization of the interface with various color themes.

## Technologies Used

- **Front-end Frameworks and Libraries**: React, Next.js
- **TypeScript**: Ensures type safety across the project.
- **Styled Components**: Manages component-level styles.
- **Monaco Editor**: Provides the code editor used in the interface.
- **P5.js**: Powers the interactive animations.
- **Deployment**: Hosted on Vercel for seamless production performance.

## Installation

To run `luisguilher.me` locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/lguibr/luisguilher.me.git
   ```
2. Navigate to the project directory:
   ```bash
   cd luisguilher.me
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Start the development server:
   ```bash
   yarn dev
   ```

Visit `http://localhost:3000` in your browser to access the interface.

## Usage

- **Interface Navigation**: Use the VS Code-like interface to browse different sections and files.
- **Editing and Viewing**: Open, edit, and manage files using the Monaco Editor.
- **Workspace Organization**: Utilize the drag and drop functionality for efficient workspace management.
- **Search Functionality**: Search within files to find specific text.
- **File Comparison**: Use the diff feature to compare edits.
- **Animations**: Enjoy interactive animations during various interactions.
- **CV Generation**: Generate a print-ready CV with `Ctrl+P`.
- **Theme Customization**: Change the interface theme from the settings.

## Project Structure

```
luisguilher.me/
│
├── public/
│   ├── icons/
│   └── ...
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Core/
│   │   ├── Home/
│   │   └── ...
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── reducers/
│   ├── services/
│   └── styles/
│
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── tsconfig.json
└── yarn.lock
```

- The `public/` directory contains public assets such as icons.
- The `src/` directory holds the main source code of the project.
  - `assets/` contains static assets like images and data files.
  - `components/` contains reusable React components organized by feature or section.
  - `contexts/` contains React context files for managing global state.
  - `hooks/` contains custom React hooks.
  - `pages/` contains Next.js page components.
  - `reducers/` contains reducer functions for managing state updates.
  - `services/` contains service files for interacting with external APIs or utilities.
  - `styles/` contains global styles and theme configuration.
- Configuration files like `.eslintrc.json`, `next.config.js`, and `tsconfig.json` are located in the root directory.

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch for your features or fixes.
3. Commit your changes with descriptive commit messages.
4. Push your branch and submit a pull request detailing your changes.

## License

This project is open-source under the MIT License. Feel free to use, modify, and distribute the code as permitted by the license.

## Final Note

Thank you for visiting `luisguilher.me`. I hope you enjoy exploring my professional portfolio and find inspiration in the projects showcased. Happy coding!
