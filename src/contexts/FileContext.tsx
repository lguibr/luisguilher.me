// File: src/contexts/FileContext.tsx
import {
  createContext,
  useState,
  useEffect,
  useReducer,
  Dispatch,
  useCallback,
  useRef,
  useMemo
} from 'react'
import { buildTree } from 'src/utils/treeUtils'
import fileReducer, {
  FileType as FileT,
  ActionType
} from 'src/reducers/FileReducer'
import { useGithubService } from 'src/services/github'
import { useL0g1n } from 'l0g1n-sdk'

import readmeContent from '../../README.md'

import curriculumContent from '../../CURRICULUM.md'

export type FileType = FileT

export type FileContextType = {
  files: FileType[]
  treeFiles: FileType[]
  diffFiles: FileType[]
  setContent: (file: FileType, content: string) => void
  setImage: (file: FileType, content: JSX.Element | undefined) => void
  setNewContent: (file: FileType, content: string) => void
  focusedFile: string | null
  setFocusedFile: (file: string | null) => void
  findTreeFile: (path: string) => FileType | null
  focusedFileView: number
  setFocusedFileView: (file: number) => void
  fetchAndMergeRepoTree: (repoName: string) => Promise<void>
  setFiles: (files: FileType[]) => void
}

export const FileContext = createContext({} as FileContextType)

export const FileProvider: React.FC = ({ children }) => {
  const repoName = process.env.REPO || 'luisguilher.me'
  const ownerName = process.env.OWNER || 'lguibr'
  const githubUsername = process.env.GITHUB_USERNAME || 'lguibr'
  const { user } = useL0g1n()
  const githubService = useGithubService()
  const fetchedReposRef = useRef<Record<string, boolean>>({})

  const initialFlatState: FileType[] = [
    {
      path: 'repositories',
      name: 'repositories',
      type: 'repo-root',
      children: []
    },
    {
      path: 'README.md',

      name: 'README.md',
      type: 'blob',
      content: readmeContent,
      newContent: readmeContent
    },
    {
      path: 'CURRICULUM.md',
      name: 'CURRICULUM.md',
      type: 'blob',
      content: curriculumContent,
      newContent: curriculumContent
    },
    {
      path: 'README.md__working__tree__',
      name: 'README.md',
      type: 'blob',
      content: readmeContent,
      newContent: readmeContent,
      isDiff: true
    },
    {
      path: 'CURRICULUM.md__working__tree__',
      name: 'CURRICULUM.md',
      type: 'blob',
      content: curriculumContent,
      newContent: curriculumContent,
      isDiff: true
    }
  ]

  const CACHE_KEY = 'GIG_FILES_CACHE_V4'

  const [files, dispatch]: [files: FileType[], dispatch: Dispatch<ActionType>] =
    useReducer(fileReducer, initialFlatState)
  const filesRef = useRef(files)
  useEffect(() => {
    filesRef.current = files
  }, [files])

  const [isLoaded, setIsLoaded] = useState(false)

  // Load from cache on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CACHE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            dispatch({ type: 'SET_FILES', payload: parsed })
          }
        } catch (e) {
          console.error('[FileContext] Failed to parse file cache')
        }
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to cache when files change
  useEffect(() => {
    if (isLoaded && files.length > initialFlatState.length) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(files))
    }
  }, [files, isLoaded])

  const mainTreeFetched = useRef(false)
  const otherReposListFetched = useRef(false) // Renamed for clarity
  const fetchingReposRef = useRef<Record<string, boolean>>({})

  // --- Stable Action Dispatchers ---
  const setFiles = useCallback((files: FileType[]) => {
    dispatch({ type: 'SET_FILES', payload: files })
  }, [])

  const setImage = useCallback(
    (selectedFile: FileType, image: JSX.Element | undefined) => {
      dispatch({ type: 'SET_IMAGE', payload: { ...selectedFile, image } })
    },
    []
  )
  const setContent = useCallback((selectedFile: FileType, content: string) => {
    dispatch({
      type: 'SET_CONTENT',
      payload: { ...selectedFile, content, type: 'blob' }
    })
  }, [])
  const setNewContent = useCallback(
    (selectedFile: FileType, newContent: string) => {
      dispatch({
        type: 'SET_NEW_CONTENT',
        payload: { ...selectedFile, newContent }
      })
    },
    []
  )

  // --- Stable Fetch Logic ---
  const fetchMainTreeCallback = useCallback(async () => {
    // console.log('[FileContext] Fetching main repo tree:', repoName);
    try {
      const rawTree = await githubService.fetchRepoTree(
        ownerName,
        repoName,
        process.env.SHA_BRANCH || 'main'
      )
      dispatch({
        type: 'MERGE_FETCHED_TREE',
        payload: { repoType: 'main', repoName, rawTree }
      })
      // console.log('[FileContext] Dispatched merge for main repo tree.');
      return true // Indicate success
    } catch (error) {
      console.error('[FileContext] Error fetching main repo tree:', error)
      return false // Indicate failure
    }
  }, [repoName, ownerName, githubService])

  const fetchAndMergeRepoTree = useCallback(
    async (repoToFetch: string, recursive = true) => {
      const repoPath = `repositories/${repoToFetch}`
      const existingNode = filesRef.current.find(f => f.path === repoPath)

      // If we already have children and we are not asking for a recursive refresh, skip
      if (
        (existingNode?.children !== undefined && !recursive) ||
        fetchingReposRef.current[repoToFetch]
      ) {
        return
      }
      if (!githubUsername) {
        console.error(
          '[FileContext] Cannot fetch repo tree, GITHUB_USERNAME not set.'
        )
        return
      }

      // console.log(`[FileContext] Demand fetch triggered for: ${repoToFetch} (recursive=${recursive})`);
      fetchingReposRef.current[repoToFetch] = true

      try {
        const owner = githubUsername
        const branch = existingNode?.defaultBranch || 'main'

        const rawTree = await githubService.fetchRepoTree(
          owner,
          repoToFetch,
          branch,
          recursive
        )
        dispatch({
          type: 'MERGE_FETCHED_TREE',
          payload: { repoType: 'other', repoName: repoToFetch, rawTree }
        })
      } catch (error) {
        console.error(
          `[FileContext] Error fetching tree for ${repoToFetch} on demand:`,
          error
        )
      } finally {
        fetchingReposRef.current[repoToFetch] = false
      }
    },
    [githubUsername, githubService]
  )

  const fetchRepoListCallback = useCallback(async () => {
    if (!githubUsername) return
    // console.log('[FileContext] Fetching repo list for user:', githubUsername);
    try {
      const repos = await githubService.fetchUserRepos(githubUsername)
      console.log(
        `[FileContext] Fetched ${repos.length} repos for user: ${githubUsername}`
      )
      const repoData = repos
        .filter(repo => repo.name !== repoName)
        .map(repo => ({ name: repo.name, defaultBranch: repo.default_branch }))
      if (repoData.length > 0) {
        console.log(
          `[FileContext] Adding placeholders for ${repoData.length} other repos.`
        )
        dispatch({
          type: 'ADD_REPO_PLACEHOLDERS',
          payload: { repos: repoData }
        })
      }
    } catch (error) {
      console.error('[FileContext] Error fetching user repos list:', error)
    }
  }, [githubUsername, repoName, githubService, fetchAndMergeRepoTree])

  // --- Effects to Trigger Initial Fetches Sequentially ---
  useEffect(() => {
    let didCancel = false // Flag to handle component unmount during async ops

    const runInitialFetches = async () => {
      // Fetch Main Tree first
      if (!mainTreeFetched.current) {
        mainTreeFetched.current = true
        // console.log("Fetching main tree...");
        await fetchMainTreeCallback()
        if (didCancel) return // Check if unmounted after await
      }

      // Then fetch Repo List (main fetch didn't cancel)
      if (!otherReposListFetched.current) {
        otherReposListFetched.current = true
        // console.log("Fetching repo list...");
        await fetchRepoListCallback()
        // No need to check didCancel here as it's the last step
      }

      // Pre-fetch the profile repository (lguibr/lguibr) so README is available
      const profileRepo = 'lguibr'
      if (githubUsername && !fetchedReposRef.current[profileRepo]) {
        fetchedReposRef.current[profileRepo] = true
        // console.log(`[FileContext] Pre-fetching profile repo: ${profileRepo}`);
        await fetchAndMergeRepoTree(profileRepo)
      }
    }

    runInitialFetches()

    // Cleanup function to set the flag on unmount
    return () => {
      didCancel = true
    }
    // Run when dependencies change (e.g. user logs in)
  }, [
    fetchMainTreeCallback,
    fetchRepoListCallback,
    fetchAndMergeRepoTree,
    githubUsername,
    user
  ])

  // --- Derive treeFiles for UI using useMemo ---
  const treeFiles = useMemo(() => {
    const nonDiffFiles = files.filter(f => !f.isDiff)
    const builtTree = buildTree(nonDiffFiles)
    return builtTree
  }, [files])

  // --- findTreeFile (searches derived tree) ---
  const findTreeFile = useCallback(
    (path: string): FileType | null => {
      const search = (
        searchPath: string,
        searchNodes: FileType[]
      ): FileType | null => {
        for (const file of searchNodes) {
          if (file.path === searchPath) return file
          if (Array.isArray(file.children) && file.children.length > 0) {
            const found = search(searchPath, file.children)
            if (found) return found
          }
        }
        return null
      }
      return search(path, treeFiles)
    },
    [treeFiles]
  )

  // --- Other State ---

  const diffFiles = files.filter(({ isDiff, diff }) => isDiff && diff)
  const [focusedFile, setFocusedFile] = useState<string | null>('README.md')

  const [focusedFileView, setFocusedFileView] = useState<number>(0)

  // --- Provider Value ---
  return (
    <FileContext.Provider
      value={{
        files,
        treeFiles,
        setContent,
        setImage,
        setNewContent,
        diffFiles,
        focusedFile,
        setFocusedFile,
        findTreeFile,
        focusedFileView,
        setFocusedFileView,
        fetchAndMergeRepoTree,
        setFiles
      }}
    >
      {children}
    </FileContext.Provider>
  )
}
