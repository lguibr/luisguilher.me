# File: src/services/README.md

This directory contains modules responsible for interacting with external services or APIs.

## Services

- **`github/index.ts`**: Handles communication with the GitHub REST API.
  - **`fetchFileContent(owner, repo, path, branch)`**: Fetches the content of a specific file from the specified repository, owner, path, and branch. Returns the base64 encoded content.
  - **`fetchRepoTree(owner, repo, branch)`**: Fetches the entire file tree structure of the specified repository and branch recursively. Returns a flat array of file/directory objects relative to the repo root.
  - **`fetchUserRepos(username)`**: Fetches a list of public repositories for the specified GitHub username.

## Configuration

The GitHub service relies on the following environment variables set in `next.config.js`:

- `REPO`: The name of the _main_ GitHub repository (e.g., 'luisguilher.me').
- `OWNER`: The owner of the _main_ GitHub repository (e.g., 'lguibr').
- `SHA_BRANCH`: The branch or commit SHA to fetch data from for the _main_ repository (e.g., 'main').
- `GITHUB_USERNAME`: The GitHub username whose public repositories should be fetched (e.g., 'lguibr').

## Usage

Import the service (e.g., `import githubService from 'src/services/github'`) and call its methods. These are typically used within contexts (`FileContext`) or potentially custom hooks to fetch initial data or file content on demand.

## Related READMEs

- [Contexts README](../contexts/README.md)
- [Root README](../../README.md)
