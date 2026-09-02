import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth.js'
import { JournalService } from '../services/journal.service.js'
import { redisClient } from '../config/redis.js'

export class DashboardController {
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId
      const cacheKey = `dashboard:${userId}`

      const cached = await redisClient.get(cacheKey)
      if (cached) {
        return res.json(JSON.parse(cached))
      }

      const entries = await JournalService.getUserEntries(userId)

      const totalEntries = entries.length

      // Check today's status
      const todayISO = new Date().toISOString()
      const todayParts = todayISO.split('T')
      const todayStr: string = todayParts[0] || ''
      const hasWrittenToday = entries.some(
        (e) => Boolean(e.createdAt) && (e.createdAt.split('T')[0] || '') === todayStr
      )

      // Calculate streak
      const rawDates = entries
        .map((e) => {
          if (!e.createdAt) return ''
          const parts = e.createdAt.split('T')
          return parts[0] || ''
        })
        .filter((d): d is string => Boolean(d))

      const entryDates = Array.from(new Set(rawDates)).sort((a, b) => b.localeCompare(a))

      let streak = 0
      let currentDate = new Date()

      for (let i = 0; i < 365; i++) {
        const iso = currentDate.toISOString()
        const dateParts = iso.split('T')
        const dateStr: string = dateParts[0] || ''
        if (entryDates.includes(dateStr)) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else if (i === 0) {
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      }

      // Recent 5 entries
      const recentEntries = [...entries]
        .sort((a, b) => {
          const dateStrA: string = a.createdAt || ''
          const dateStrB: string = b.createdAt || ''
          const timeA = dateStrA ? new Date(dateStrA).getTime() : 0
          const timeB = dateStrB ? new Date(dateStrB).getTime() : 0
          return timeB - timeA
        })
        .slice(0, 5)

      // Mood counts
      const moodCounts: Record<string, number> = {}
      entries.forEach((e) => {
        if (e.mood) {
          moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1
        }
      })

      // Tag counts
      const tagCounts: Record<string, number> = {}
      entries.forEach((e) => {
        if (Array.isArray(e.tags)) {
          e.tags.forEach((t) => {
            if (t) {
              tagCounts[t] = (tagCounts[t] || 0) + 1
            }
          })
        }
      })

      const dashboardData = {
        totalEntries,
        hasWrittenToday,
        streak,
        recentEntries,
        moodCounts,
        tagCounts,
      }

      await redisClient.setex(cacheKey, 60, JSON.stringify(dashboardData))

      return res.json(dashboardData)
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      return res.status(500).json({ message: 'Error fetching dashboard data' })
    }
  }
}
