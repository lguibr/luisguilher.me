import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface ToolCallData {
  name: string
  args?: any
  resultSummary?: string
  readFiles?: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'model' | 'system'
  text: string
  timestamp: number
  toolCalls?: ToolCallData[]
  tokenUsage?: {
    prompt: number
    completion: number
  }
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: number
}

interface ChatDBSchema extends DBSchema {
  conversations: {
    key: string
    value: Conversation
  }
}

let dbPromise: Promise<IDBPDatabase<ChatDBSchema>> | null = null

export const initDB = () => {
  if (typeof window === 'undefined') return null
  if (!dbPromise) {
    dbPromise = openDB<ChatDBSchema>('AIAgentChatDB', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 2) {
          if (db.objectStoreNames.contains('conversations')) {
            db.deleteObjectStore('conversations')
          }
          db.createObjectStore('conversations', { keyPath: 'id' })
        } else if (!db.objectStoreNames.contains('conversations')) {
          db.createObjectStore('conversations', { keyPath: 'id' })
        }
      }
    })
  }
  return dbPromise
}

export const getAllConversations = async (): Promise<Conversation[]> => {
  const db = await initDB()
  if (!db) return []
  return db.getAll('conversations')
}

export const getConversation = async (id: string) => {
  const db = await initDB()
  if (!db) return null
  return db.get('conversations', id)
}

export const saveConversation = async (
  id: string,
  title: string,
  messages: ChatMessage[]
) => {
  const db = await initDB()
  if (!db) return
  await db.put('conversations', {
    id,
    title,
    messages,
    updatedAt: Date.now()
  })
}

export const clearConversation = async (id: string) => {
  const db = await initDB()
  if (!db) return
  await db.delete('conversations', id)
}
