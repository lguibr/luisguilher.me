// File: src/services/github/index.ts
/* eslint-disable camelcase */
import { useL0g1n } from 'l0g1n-sdk'
import { toast } from 'sonner'

const defaultBranchSha = process.env.SHA_BRANCH || 'main'
const defaultRepo = process.env.REPO
const defaultOwner = process.env.OWNER

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

let hasWarnedAboutPat = false

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json'
  }
  if (!hasWarnedAboutPat) {
    console.warn(
      '[GitHub Service] Making unauthenticated requests (likely to be rate limited). Login to unlock better limits.'
    )
    hasWarnedAboutPat = true
  }
  return headers
}

export const useGithubService = () => {
  const { user, fetchGithubData } = useL0g1n()

  const safeFetch = async <T>(apiUrl: string): Promise<T> => {
    // If logged in via L0G1n SDK, proxy through Firebase Functions
    if (user) {
      try {
        return await fetchGithubData<T>(apiUrl)
      } catch (err: any) {
        console.error(
          'L0G1n Proxy fetch failed, falling back to direct fetch',
          err
        )
      }
    }

    // Fallback: direct unauthenticated fetch
    const res = await fetch(apiUrl, { headers: getHeaders() })

    if (res.status === 403 || res.status === 429) {
      toast.error(
        'GitHub API Rate Limit Reached! Please login with GitHub to increase your limits.'
      )
      throw new Error(`Rate limit reached: ${res.status}`)
    }

    const contentType = res.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || `Failed to fetch: ${apiUrl}`)
      return data
    } else {
      const text = await res.text()
      if (!res.ok) throw new Error(`Failed to fetch: ${apiUrl} (${res.status})`)
      return {
        content:
          typeof window !== 'undefined'
            ? window.btoa(unescape(encodeURIComponent(text)))
            : btoa(text)
      } as unknown as T
    }
  }

  const fetchFileContent = async (
    owner: string = defaultOwner || '',
    repo: string = defaultRepo || '',
    path: string,
    branch: string = defaultBranchSha
  ): Promise<ResFileType> => {
    if (!owner || !repo)
      throw new Error('GitHub owner or repo not configured/provided.')
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    if (!cleanPath)
      throw new Error('Cannot fetch content for empty path (repository root).')

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`
    return safeFetch<ResFileType>(apiUrl)
  }

  const fetchRepoTree = async (
    owner: string = defaultOwner || '',
    repo: string = defaultRepo || '',
    branch: string = defaultBranchSha
  ): Promise<ResTreeFileType[]> => {
    if (!owner || !repo)
      throw new Error('GitHub owner or repo not configured/provided.')

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    try {
      const data: any = await safeFetch(apiUrl)
      if (data.truncated) {
        console.warn(
          `[GitHub Service] Warning: Fetched tree for ${repo} was truncated. Some files may be missing.`
        )
      }
      return data.tree || []
    } catch (e) {
      return []
    }
  }

  const fetchUserRepos = async (username: string): Promise<ResRepoType[]> => {
    if (!username) throw new Error('GitHub username not provided.')

    const apiUrl = `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`
    try {
      const data: any = await safeFetch(apiUrl)
      return data || []
    } catch (e) {
      return []
    }
  }

  return { fetchFileContent, fetchRepoTree, fetchUserRepos }
}

// Temporary fallback for anywhere that can't use hooks (e.g. getServerSideProps or ai.ts)
const legacyGithubService = {
  fetchFileContent: async (
    owner: string = defaultOwner || '',
    repo: string = defaultRepo || '',
    path: string,
    branch: string = defaultBranchSha
  ): Promise<ResFileType> => {
    if (!owner || !repo) return { content: '' }
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`
    const res = await fetch(apiUrl, { headers: getHeaders() })
    if (res.status === 403 || res.status === 429) {
      toast.error(
        'GitHub API Rate Limit Reached! AI cannot read more files right now.'
      )
      return { content: '' }
    }
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await res.json()
      if (!res.ok) return { content: '' }
      return data as ResFileType
    }
    const text = await res.text()
    return {
      content:
        typeof window !== 'undefined'
          ? window.btoa(unescape(encodeURIComponent(text)))
          : btoa(text)
    } as ResFileType
  },
  fetchRepoTree: async (
    owner: string = defaultOwner || '',
    repo: string = defaultRepo || '',
    branch: string = defaultBranchSha
  ): Promise<ResTreeFileType[]> => {
    if (!owner || !repo) return []
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    const res = await fetch(apiUrl, { headers: getHeaders() })
    if (res.status === 403 || res.status === 429) {
      toast.error(
        'GitHub API Rate Limit Reached! AI cannot read repository trees right now.'
      )
      return []
    }
    const data = await res.json()
    return data.tree || []
  },
  fetchUserRepos: async () => [] as ResRepoType[]
}
export default legacyGithubService
