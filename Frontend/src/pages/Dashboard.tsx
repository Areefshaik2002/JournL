import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardAPI } from '../services/api'
import type { DashboardData } from '../services/api'
import {
  Flame,
  BookCheck,
  CalendarCheck2,
  PlusCircle,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  Zap,
  Tag,
} from 'lucide-react'

const MOOD_ICONS: Record<string, { icon: React.FC<{ className?: string }>; color: string; label: string }> = {
  happy: { icon: Smile, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', label: 'Happy 😊' },
  calm: { icon: Smile, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: 'Calm 🌿' },
  neutral: { icon: Meh, color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', label: 'Neutral 😐' },
  sad: { icon: Frown, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', label: 'Sad 🌧️' },
  anxious: { icon: Frown, color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', label: 'Anxious ⚡' },
  energetic: { icon: Zap, color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', label: 'Energetic 🚀' },
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await dashboardAPI.getSummary()
        setData(response.data)
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 p-8 shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="mt-2 text-base text-slate-300">
              {data?.hasWrittenToday
                ? "Awesome! You've already recorded your journal for today."
                : "You haven't written today yet. Capture your thoughts in 5 minutes!"}
            </p>
          </div>
          <Link
            to="/journal/new"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="h-5 w-5" />
            Write Today's Entry
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Streak */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Writing Streak
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{data?.streak || 0}</span>
            <span className="text-sm font-medium text-slate-400">days</span>
          </div>
        </div>

        {/* Total Entries */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Journals
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookCheck className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{data?.totalEntries || 0}</span>
            <span className="text-sm font-medium text-slate-400">entries recorded</span>
          </div>
        </div>

        {/* Today's Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Today's Status
            </span>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                data?.hasWrittenToday
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              <CalendarCheck2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">
              {data?.hasWrittenToday ? 'Completed 🎉' : 'Pending ⏳'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Entries</h2>
          <Link
            to="/timeline"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {data?.recentEntries && data.recentEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.recentEntries.map((entry) => {
              const moodMeta = MOOD_ICONS[entry.mood] || MOOD_ICONS.neutral
              return (
                <Link
                  key={entry.journalId}
                  to={`/journal/${entry.journalId}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm hover:border-slate-700 hover:bg-slate-800/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium ${moodMeta.color}`}>
                        {moodMeta.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {entry.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                      {entry.content}
                    </p>
                  </div>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                      {entry.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md"
                        >
                          <Tag className="h-3 w-3 text-slate-500" /> {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 py-12 text-center">
            <BookCheck className="h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">No journal entries written yet.</p>
            <Link
              to="/journal/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:underline"
            >
              Write your first entry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
