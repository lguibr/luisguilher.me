const branchSha = process.env.SHA_BRANCH
const repo = process.env.REPO
const owner = process.env.OWNER

type ResTreeFilesType = {
  path: string
  mode?: string
  type?: string
  sha?: string
  size?: number
  url?: string
}
type ResFileType = {
  content: string
}

const githubService = {
  fetchFileContent: async (path: string): Promise<ResFileType> => {
    const filePath = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branchSha}`
    const res = await fetch(filePath)
    const data = await res.json()
    return data
  },
  fetchRepoTree: async (): Promise<ResTreeFilesType[]> => {
    const threePath = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branchSha}?recursive=1`
    const res = await fetch(threePath)
    const data = await res.json()
    const rawTree = data.tree
    return rawTree
  }
}

export default githubService
