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
    return entry
  }

  static async getUserEntries(userId: string): Promise<JournalEntry[]> {
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
        return (response.Items as JournalEntry[]) || []
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
        return (response.Items as JournalEntry[]) || []
      }
    } else {
      const userEntries: JournalEntry[] = []
      for (const entry of mockJournalsStore.values()) {
        if (entry.userId === userId) {
          userEntries.push(entry)
        }
      }
      return userEntries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
  }

  static async getEntryById(userId: string, journalId: string): Promise<JournalEntry | null> {
    if (hasAwsCredentials && docClient) {
      try {
        const response = await docClient.send(
          new GetCommand({
            TableName: JOURNALS_TABLE,
            Key: { userId, journalId },
          })
        )
        return (response.Item as JournalEntry) || null
      } catch {
        const response = await docClient.send(
          new GetCommand({
            TableName: JOURNALS_TABLE,
            Key: { journalId },
          })
        )
        return (response.Item as JournalEntry) || null
      }
    } else {
      const entry = mockJournalsStore.get(journalId)
      if (entry && entry.userId === userId) {
        return entry
      }
      return null
    }
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

    return true
  }
}
