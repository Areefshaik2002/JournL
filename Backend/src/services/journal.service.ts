import { redisClient } from '../config/redis.js'
import type { JournalEntry } from '../models/types.js'
import {
  PutCommand,
  QueryCommand,
  GetCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import { docClient, hasAwsCredentials } from '../config/db.js'

const JOURNALS_TABLE = process.env.JOURNALS_TABLE_NAME || 'JournL-Journals'

// In-memory fallback store
const mockJournalsStore: Map<string, JournalEntry> = new Map()

export class JournalService {
  static async createEntry(entry: JournalEntry): Promise<JournalEntry> {
    if (hasAwsCredentials && docClient) {
      await docClient.send(
        new PutCommand({
          TableName: JOURNALS_TABLE,
          Item: entry,
        })
      )
    } else {
      mockJournalsStore.set(entry.journalId, entry)
    }
    await redisClient.del(`journals:${entry.userId}`)
    await redisClient.del(`dashboard:${entry.userId}`)
    return entry
  }

  static async getUserEntries(userId: string): Promise<JournalEntry[]> {
    const cacheKey = `journals:${userId}`

    const cached = await redisClient.get(cacheKey)
    if (cached) {
      return JSON.parse(cached) as JournalEntry[]
    }

    let entries: JournalEntry[] = []

    if (hasAwsCredentials && docClient) {
      try {
        const response = await docClient.send(
          new QueryCommand({
            TableName: JOURNALS_TABLE,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId,
            },
          })
        )
        entries = (response.Items as JournalEntry[]) || []
      } catch {
        const response = await docClient.send(
          new ScanCommand({
            TableName: JOURNALS_TABLE,
            FilterExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId,
            },
          })
        )
        entries = (response.Items as JournalEntry[]) || []
      }
    } else {
      for (const entry of mockJournalsStore.values()) {
        if (entry.userId === userId) entries.push(entry)
      }
      entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    await redisClient.setex(cacheKey, 90, JSON.stringify(entries))

    return entries
  }

  static async getEntryById(userId: string, journalId: string): Promise<JournalEntry | null> {
    const cacheKey = `journal:${userId}:${journalId}`

    const cached = await redisClient.get(cacheKey)
    if (cached) {
      return JSON.parse(cached) as JournalEntry
    }

    let entry: JournalEntry | null = null

    if (hasAwsCredentials && docClient) {
      try {
        const response = await docClient.send(
          new GetCommand({
            TableName: JOURNALS_TABLE,
            Key: { userId, journalId },
          })
        )
        entry = (response.Item as JournalEntry) || null
      } catch {
        const response = await docClient.send(
          new GetCommand({
            TableName: JOURNALS_TABLE,
            Key: { journalId },
          })
        )
        entry = (response.Item as JournalEntry) || null
      }
    } else {
      const found = mockJournalsStore.get(journalId)
      if (found && found.userId === userId) {
        entry = found
      }
    }

    if (entry) {
      await redisClient.setex(cacheKey, 90, JSON.stringify(entry))
    }

    return entry
  }

  static async updateEntry(
    userId: string,
    journalId: string,
    updates: Partial<Pick<JournalEntry, 'title' | 'content' | 'mood' | 'tags'>>
  ): Promise<JournalEntry | null> {
    const existing = await this.getEntryById(userId, journalId)
    if (!existing) return null

    const updatedEntry: JournalEntry = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    if (hasAwsCredentials && docClient) {
      await docClient.send(
        new PutCommand({
          TableName: JOURNALS_TABLE,
          Item: updatedEntry,
        })
      )
    } else {
      mockJournalsStore.set(journalId, updatedEntry)
    }

    await redisClient.del(`journals:${userId}`)
    await redisClient.del(`dashboard:${userId}`)
    await redisClient.del(`journal:${userId}:${journalId}`)

    return updatedEntry
  }

  static async deleteEntry(userId: string, journalId: string): Promise<boolean> {
    const existing = await this.getEntryById(userId, journalId)
    if (!existing) return false

    if (hasAwsCredentials && docClient) {
      try {
        await docClient.send(
          new DeleteCommand({
            TableName: JOURNALS_TABLE,
            Key: { userId, journalId },
          })
        )
      } catch {
        await docClient.send(
          new DeleteCommand({
            TableName: JOURNALS_TABLE,
            Key: { journalId },
          })
        )
      }
    } else {
      mockJournalsStore.delete(journalId)
    }

    await redisClient.del(`journals:${userId}`)
    await redisClient.del(`dashboard:${userId}`)
    await redisClient.del(`journal:${userId}:${journalId}`)

    return true
  }
}
