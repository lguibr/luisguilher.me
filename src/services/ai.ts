import { GoogleGenAI } from '@google/genai'
import githubService from './github'

const parsePath = (
  fullPath: string | null | undefined
): { owner: string; repo: string; path: string; branch: string } | null => {
  if (!fullPath) return null
  const defaultOwner = process.env.OWNER || 'lguibr'
  const defaultRepo = process.env.REPO || 'luisguilher.me'
  const defaultBranch = process.env.SHA_BRANCH || 'main'
  const parts = fullPath.split('/')
  if (parts[0] === 'repositories' && parts.length >= 2) {
    const repoName = parts[1]
    const actualPath = parts.length > 2 ? parts.slice(2).join('/') : ''
    const owner = process.env.GITHUB_USERNAME || defaultOwner
    const branch = 'main'
    return { owner, repo: repoName, path: actualPath, branch }
  } else if (parts[0] === 'resume') {
    return {
      owner: defaultOwner,
      repo: defaultRepo,
      path: fullPath,
      branch: defaultBranch
    }
  } else {
    const mainRepoName = defaultRepo
    const actualPath = fullPath === mainRepoName ? '' : fullPath
    return {
      owner: defaultOwner,
      repo: mainRepoName,
      path: actualPath,
      branch: defaultBranch
    }
  }
}

export interface OpenFileContext {
  path: string
  content: string
}

export const generateChatTitle = async (
  apiKey: string,
  _model: string,
  firstMessage: string
): Promise<string> => {
  if (!apiKey || !firstMessage.trim()) return firstMessage.slice(0, 30) + '...'

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: `You are a conversation titler. Generate a short, concise, and professional title (maximum 4 words) for the following chat message. Do not include quotes or markdown formatting. Message: "${firstMessage}"`
    })

    if (response.text) {
      return response.text.trim().replace(/^["']|["']$/g, '')
    }
  } catch (error) {
    console.error('Failed to generate chat title:', error)
  }

  return firstMessage.slice(0, 30) + '...'
}

export const generateChatResponse = async (
  apiKey: string,
  model: string,
  messages: { role: 'user' | 'model'; text: string }[],
  openFiles: OpenFileContext[],
  allFiles: { path: string; content?: string | null }[],
  mentionedFiles: string[] = []
) => {
  if (!apiKey) {
    throw new Error('API Key is required')
  }

  const ai = new GoogleGenAI({ apiKey })

  const getOpenFilesTool = {
    name: 'get_open_files_content',
    description:
      'Reads the contents of all files currently opened by the user in the application. Use this to understand the code the user is currently looking at.',
    parameters: {
      type: 'OBJECT',
      properties: {}
    }
  }

  const readFileContentTool = {
    name: 'read_file_content',
    description:
      'Reads the full content of a specific file from the repository by its path.',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: {
          type: 'STRING',
          description:
            'The exact path of the file to read (e.g. "src/index.tsx")'
        }
      },
      required: ['path']
    }
  }

  const grepCodebaseTool = {
    name: 'grep_codebase',
    description:
      'Search for a text pattern or regex within the contents of all loaded files. Use this to find where specific functions, variables, or strings are defined or used. Equivalent to "grep -r".',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description:
            'The text or regex pattern to search for within file contents.'
        }
      },
      required: ['query']
    }
  }

  const findFilesTool = {
    name: 'find_files',
    description:
      'Search for files by name or path pattern across the entire project. Use this when you know part of a filename but not its full path. Equivalent to "find . -name".',
    parameters: {
      type: 'OBJECT',
      properties: {
        pattern: {
          type: 'STRING',
          description:
            'The filename or path pattern to search for (e.g. "index.tsx" or "components/").'
        }
      },
      required: ['pattern']
    }
  }

  const listDirectoryTool = {
    name: 'list_directory',
    description:
      'List all files in a specific directory or repository. Use this to explore the project structure level by level. Equivalent to "ls -R".',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: {
          type: 'STRING',
          description:
            'The path or repository name to list (e.g. "repositories/repoName" or "src/components")'
        }
      },
      required: ['path']
    }
  }

  // Format messages for the new SDK
  const formattedMessages: any[] = messages.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }))

  const allFilePaths = allFiles.map(f => f.path).join('\n')

  let mentionedFilesContext = ''
  if (mentionedFiles.length > 0) {
    const limitedMentions = mentionedFiles.slice(-4) // Only take the last 4 mentioned files to save tokens
    const mentionedContents = limitedMentions
      .map(path => {
        const file = allFiles.find(f => f.path === path)
        return `File: ${path}\n${file?.content || '(empty or not found)'}`
      })
      .join('\n\n')
    mentionedFilesContext = `\n\nThe user explicitly mentioned these files (limited to max 4). Use them as context:\n${mentionedContents}`
  }

  const systemInstruction = `You are AI Agent, a highly capable AI assistant embedded in a code portfolio website. 
You are pair programming with the user.
You have access to the following tools:
1. 'get_open_files_content': Read the files the user currently has open. Use it when the user asks about "this file" or "my code".
2. 'read_file_content': Read any specific file from the project tree.
3. 'grep_codebase': Search for text/regex INSIDE files. Use this to find definitions or usages of code symbols.
4. 'find_files': Search for files by NAME. Use this to locate files when you don't know the exact path.
5. 'list_directory': List files in a path or fetch the file tree of a repository. Use this to explore the project structure.

Before taking any action or responding to the user, you MUST think step-by-step and enclose your internal reasoning within <thought> and </thought> tags.

Available files in the project:
${allFilePaths}${mentionedFilesContext}

Respond concisely and format your code properly.`

  const extractUsage = (res: any) => {
    if (res.usageMetadata) {
      return {
        prompt: res.usageMetadata.promptTokenCount || 0,
        completion: res.usageMetadata.candidatesTokenCount || 0
      }
    }
    return undefined
  }

  try {
    const currentFormattedMessages = [...formattedMessages]
    let currentResponse = await ai.models.generateContent({
      model,
      contents: currentFormattedMessages,
      config: {
        systemInstruction,
        tools: [
          {
            functionDeclarations: [
              getOpenFilesTool as any,
              readFileContentTool as any,
              grepCodebaseTool as any,
              findFilesTool as any,
              listDirectoryTool as any
            ]
          }
        ]
      }
    })

    const toolCallsLog: any[] = []
    let callCount = 0
    const MAX_TOOL_CALLS = 3

    // Handle multi-step tool calls
    while (
      currentResponse.functionCalls &&
      currentResponse.functionCalls.length > 0 &&
      callCount < MAX_TOOL_CALLS
    ) {
      callCount++
      const functionResponseParts: any[] = []

      for (const call of currentResponse.functionCalls) {
        let toolResponseData: any = {}
        let resultSummary = ''
        let readFiles: string[] = []

        if (call.name === 'get_open_files_content') {
          readFiles = openFiles.map(f => f.path)
          resultSummary = `Read ${openFiles.length} open files.`
          toolResponseData = {
            files: openFiles.map(f => ({
              path: f.path,
              content: f.content || '(empty file)'
            }))
          }
        } else if (call.name === 'read_file_content') {
          const targetPath = call.args?.path as string
          const targetFile = allFiles.find(f => f.path === targetPath)
          readFiles = targetPath ? [targetPath] : []

          let fileContent = targetFile?.content

          if (!fileContent && targetPath) {
            try {
              const parsed = parsePath(targetPath)
              if (parsed && parsed.path) {
                const res = await githubService.fetchFileContent(
                  parsed.owner,
                  parsed.repo,
                  parsed.path,
                  parsed.branch
                )
                if (res && res.content) {
                  fileContent = decodeURIComponent(escape(atob(res.content)))
                }
              }
            } catch (err: any) {
              console.error('AI failed to dynamically fetch file:', err)
            }
          }

          if (fileContent || targetFile) {
            resultSummary = `Read file: ${targetPath}`
            toolResponseData = {
              path: targetPath,
              content: fileContent || '(empty file)'
            }
          } else {
            resultSummary = `Attempted to read ${targetPath} but file was not found.`
            toolResponseData = {
              error: `File not found: ${targetPath}`
            }
          }
        } else if (call.name === 'grep_codebase') {
          const query = call.args?.query as string
          const snippets: any[] = []
          try {
            const regex = new RegExp(query, 'gi')
            allFiles.forEach(file => {
              if (file.content) {
                const lines = file.content.split('\n')
                lines.forEach((line, index) => {
                  if (regex.test(line)) {
                    snippets.push({
                      path: file.path,
                      line: index + 1,
                      content: line.trim()
                    })
                  }
                  regex.lastIndex = 0 // reset
                })
              }
            })
            resultSummary = `Grepped for "${query}" (found ${snippets.length} matches)`
            toolResponseData = { snippets: snippets.slice(0, 50) } // Limit to 50
          } catch (e: any) {
            resultSummary = `Grep failed for "${query}"`
            toolResponseData = { error: e.message }
          }
        } else if (call.name === 'find_files') {
          const pattern = (call.args?.pattern as string) || ''
          const matchedPaths = allFiles
            .filter(f => f.path.toLowerCase().includes(pattern.toLowerCase()))
            .map(f => f.path)

          resultSummary = `Found ${matchedPaths.length} files matching "${pattern}"`
          toolResponseData = { files: matchedPaths.slice(0, 100) }
        } else if (call.name === 'list_directory') {
          const targetPath = (call.args?.path as string) || ''
          const parsed = parsePath(targetPath)
          let paths: string[] = []

          if (
            parsed &&
            (parsed.path === '' || targetPath === `repositories/${parsed.repo}`)
          ) {
            const repoFiles = allFiles.filter(f =>
              f.path.startsWith(`repositories/${parsed.repo}/`)
            )
            if (repoFiles.length <= 1) {
              try {
                const tree = await githubService.fetchRepoTree(
                  parsed.owner,
                  parsed.repo,
                  parsed.branch
                )
                paths = tree.map(
                  t => `repositories/${parsed.repo}/${t.path || ''}`
                )
              } catch (e: any) {
                paths = [`(Failed to fetch repo tree: ${e.message})`]
              }
            } else {
              paths = repoFiles.map(f => f.path)
            }
          } else {
            paths = allFiles
              .filter(f => f.path.startsWith(targetPath))
              .map(f => f.path)

            if (paths.length === 0 && parsed) {
              try {
                const tree = await githubService.fetchRepoTree(
                  parsed.owner,
                  parsed.repo,
                  parsed.branch
                )
                paths = tree
                  .map(t => {
                    if (targetPath.startsWith('repositories/')) {
                      return `repositories/${parsed.repo}/${t.path || ''}`
                    } else if (targetPath.startsWith('resume/')) {
                      return `resume/${t.path || ''}`
                    } else {
                      return t.path || ''
                    }
                  })
                  .filter(p => p.startsWith(targetPath))
              } catch (e: any) {}
            }
          }

          resultSummary = `Listed directory: ${targetPath}`
          toolResponseData = {
            files: paths.slice(0, 500)
          }
        }

        const toolCallLogEntry = {
          name: call.name || 'unknown',
          args: call.args,
          resultSummary,
          readFiles
        }
        toolCallsLog.push(toolCallLogEntry)

        functionResponseParts.push({
          functionResponse: {
            name: call.name,
            response: toolResponseData
          }
        })
      }

      if (
        currentResponse.candidates &&
        currentResponse.candidates.length > 0 &&
        currentResponse.candidates[0].content
      ) {
        currentFormattedMessages.push(currentResponse.candidates[0].content)
      } else {
        currentFormattedMessages.push({
          role: 'model',
          parts: currentResponse.functionCalls.map(c => ({ functionCall: c }))
        })
      }

      currentFormattedMessages.push({
        role: 'user',
        parts: functionResponseParts
      })

      currentResponse = await ai.models.generateContent({
        model,
        contents: currentFormattedMessages,
        config: {
          systemInstruction,
          tools: [
            {
              functionDeclarations: [
                getOpenFilesTool as any,
                readFileContentTool as any,
                grepCodebaseTool as any,
                findFilesTool as any,
                listDirectoryTool as any
              ]
            }
          ]
        }
      })
    }

    if (
      currentResponse.functionCalls &&
      currentResponse.functionCalls.length > 0 &&
      callCount >= MAX_TOOL_CALLS
    ) {
      if (
        currentResponse.candidates &&
        currentResponse.candidates.length > 0 &&
        currentResponse.candidates[0].content
      ) {
        currentFormattedMessages.push(currentResponse.candidates[0].content)
      } else {
        currentFormattedMessages.push({
          role: 'model',
          parts: currentResponse.functionCalls.map(c => ({ functionCall: c }))
        })
      }

      currentFormattedMessages.push({
        role: 'user',
        parts: [
          {
            text: `System: You have reached the maximum number of tool calls (${MAX_TOOL_CALLS}) allowed for this turn. You cannot use any more tools right now. Please summarize the information you have gathered so far and let the user know if there is anything else you need to explore next.`
          }
        ]
      })

      currentResponse = await ai.models.generateContent({
        model,
        contents: currentFormattedMessages,
        config: {
          systemInstruction
        }
      })
    }

    let finalText = ''
    if (
      currentResponse.candidates &&
      currentResponse.candidates.length > 0 &&
      currentResponse.candidates[0].content &&
      currentResponse.candidates[0].content.parts
    ) {
      const parts = currentResponse.candidates[0].content.parts
      const textParts = parts.filter((p: any) => p.text)
      if (textParts.length > 0) {
        finalText = textParts.map((p: any) => p.text).join('\n')
      } else {
        finalText = `[Agent stopped: Unable to generate text summary]`
      }
    } else {
      try {
        finalText = currentResponse.text || ''
      } catch (e) {}
    }

    return {
      text: finalText,
      toolCalls: toolCallsLog,
      tokenUsage: extractUsage(currentResponse)
    }
  } catch (err: any) {
    console.error('Error in AI generation:', err)
    throw err
  }
}
