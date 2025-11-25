// File: src/services/github/index.ts
/* eslint-disable camelcase */
const defaultBranchSha = process.env.SHA_BRANCH || 'main'
const defaultRepo = process.env.REPO
const defaultOwner = process.env.OWNER
const githubPat = process.env.GITHUB_PAT // Get the PAT from env

type ResTreeFileType = {
  path: string
  mode?: string
  type?: string // 'blob' or 'tree'
  sha?: string
  size?: number
  url?: string
}

type ResFileType = {
  content: string
  message?: string
}

type ResRepoType = {
  name: string
  full_name: string
  owner: {
    login: string
  }
  default_branch: string
}

// Common headers for authenticated requests
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json'
  }
  if (githubPat) {
    headers.Authorization = `token ${githubPat}`
  } else {
    // Warn only once or less frequently if needed
    console.warn(
      '[GitHub Service] GITHUB_PAT not found. Making unauthenticated requests (likely to be rate limited).'
    )
  }
  return headers
}

const githubService = {
  fetchFileContent: async (
    owner: string = defaultOwner || '',
    repo: string = defaultRepo || '',
    path: string,
    branch: string = defaultBranchSha
  ): Promise<ResFileType> => {
    if (!owner || !repo) {
      throw new Error('GitHub owner or repo not configured/provided.')
    }
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    if (!cleanPath) {
      throw new Error('Cannot fetch content for empty path (repository root).')
    }
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`
    const res = await fetch(apiUrl, { headers: getHeaders() }) // Add headers
    const data: ResFileType = await res.json()
    if (!res.ok) {
      console.error(
        `[GitHub Service] Error fetching file content (${res.status}) for ${owner}/${repo}/${cleanPath}: ${data.message}`
      )
      throw new Error(data.message || `Failed to fetch file content: ${path}`)
    }
    return data
  },

  fetchRepoTree: async (
    owner: string = defaultOwner || '',
    repo: string = defaultRepo || '',
    branch: string = defaultBranchSha
  ): Promise<ResTreeFileType[]> => {
    if (!owner || !repo) {
      throw new Error('GitHub owner or repo not configured/provided.')
    }
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    const res = await fetch(apiUrl, { headers: getHeaders() }) // Add headers
    const data = await res.json()

    if (!res.ok) {
      console.error(
        `[GitHub Service] Error fetching repo tree (${res.status}) for ${owner}/${repo}: ${data.message}`
      )
      return [] // Return empty on error
    }

    if (data.truncated) {
      console.warn(
        `[GitHub Service] Warning: Fetched tree for ${repo} was truncated. Some files may be missing.`
      )
    }

    const rawTree: ResTreeFileType[] = data.tree || []
    return rawTree
  },

  fetchUserRepos: async (username: string): Promise<ResRepoType[]> => {
    if (!username) {
      throw new Error('GitHub username not provided.')
    }
    const apiUrl = `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`
    const res = await fetch(apiUrl, { headers: getHeaders() }) // Add headers

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: 'Failed to parse error response' }))
      console.error(
        `[GitHub Service] Error fetching user repos (${res.status}): ${errorData.message}`
      )
      return [] // Return empty on error
    }
    const data: ResRepoType[] = await res.json()
    return data
  }
}

export default githubService
