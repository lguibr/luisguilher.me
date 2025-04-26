This directory contains modules responsible for interacting with external services or APIs.

## Services

- **`github/index.ts`**: Handles communication with the GitHub REST API.
  - **`fetchFileContent(path)`**: Fetches the content of a specific file from the repository defined by environment variables (`OWNER`, `REPO`, `SHA_BRANCH`). Returns the base64 encoded content.
  - **`fetchRepoTree()`**: Fetches the entire file tree structure of the repository recursively for the specified branch (`SHA_BRANCH`). Returns a flat array of file/directory objects.

## Configuration

The GitHub service relies on the following environment variables set in `next.config.js`:

- `REPO`: The name of the GitHub repository (e.g., 'luisguilher.me').
- `OWNER`: The owner of the GitHub repository (e.g., 'lguibr').
- `SHA_BRANCH`: The branch or commit SHA to fetch data from (e.g., 'main').

## Usage

Import the service (e.g., `import githubService from 'src/services/github'`) and call its methods. These are typically used within contexts (`FileContext`) or potentially custom hooks to fetch initial data or file content on demand.

## Related READMEs

- [Contexts README](../contexts/README.md)
- [Root README](../../README.md)
