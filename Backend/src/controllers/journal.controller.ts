import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth.js'
import { v4 as uuidv4 } from 'uuid'
import { JournalService } from '../services/journal.service.js'

export class JournalController {
  static async getJournals(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId
      const journals = await JournalService.getUserEntries(userId)
      return res.json(journals)
    } catch (error) {
      console.error('Error fetching journals:', error)
      return res.status(500).json({ message: 'Error fetching journals' })
    }
  }

  static async getJournalById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId
      const idParam = req.params['id']
      const journalId = typeof idParam === 'string' ? idParam : ''
      const journal = await JournalService.getEntryById(userId, journalId)
      if (!journal) {
        return res.status(404).json({ message: 'Journal entry not found' })
      }
      return res.json(journal)
    } catch (error) {
      console.error('Error fetching journal by id:', error)
      return res.status(500).json({ message: 'Error fetching journal entry' })
    }
  }

  static async createJournal(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId
      const { title, content, mood, tags } = req.body

      if (!title || !content || !mood) {
        return res.status(400).json({ message: 'Title, content, and mood are required' })
      }

      const newEntry = await JournalService.createEntry({
        journalId: uuidv4(),
        userId,
        title,
        content,
        mood,
        tags: Array.isArray(tags) ? tags : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      return res.status(201).json(newEntry)
    } catch (error) {
      console.error('Error creating journal:', error)
      return res.status(500).json({ message: 'Error creating journal entry' })
    }
  }

  static async updateJournal(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId
      const idParam = req.params['id']
      const journalId = typeof idParam === 'string' ? idParam : ''
      const { title, content, mood, tags } = req.body

      const updated = await JournalService.updateEntry(userId, journalId, {
        title,
        content,
        mood,
        tags,
      })

      if (!updated) {
        return res.status(404).json({ message: 'Journal entry not found' })
      }

      return res.json(updated)
    } catch (error) {
      console.error('Error updating journal:', error)
      return res.status(500).json({ message: 'Error updating journal entry' })
    }
  }

  static async deleteJournal(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId
      const idParam = req.params['id']
      const journalId = typeof idParam === 'string' ? idParam : ''
      const success = await JournalService.deleteEntry(userId, journalId)
      if (!success) {
        return res.status(404).json({ message: 'Journal entry not found' })
      }
      return res.json({ message: 'Journal entry deleted successfully' })
    } catch (error) {
      console.error('Error deleting journal:', error)
      return res.status(500).json({ message: 'Error deleting journal entry' })
    }
  }
}
