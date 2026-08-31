export interface User {
  userId: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

export type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'energetic'

export interface JournalEntry {
  journalId: string
  userId: string
  title: string
  content: string
  mood: MoodType
  tags: string[]
  createdAt: string
  updatedAt: string
}
