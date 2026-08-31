import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { journalAPI } from '../services/api'
import type { JournalEntry } from '../services/api'
import { Search, Filter, ArrowUpDown, Tag, PlusCircle } from 'lucide-react'

const MOOD_ICONS: Record<string, { label: string; color: string }> = {
  happy: { label: 'Happy 😊', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  calm: { label: 'Calm 🌿', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  neutral: { label: 'Neutral 😐', color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
  sad: { label: 'Sad 🌧️', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  anxious: { label: 'Anxious ⚡', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  energetic: { label: 'Energetic 🚀', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
}

export const Timeline: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await journalAPI.getAll()
        setEntries(res.data)
      } catch (err) {
        console.error('Error fetching timeline entries:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  // Extract all unique tags
  const allTags = Array.from(
    new Set(entries.flatMap((e) => (Array.isArray(e.tags) ? e.tags : [])))
  )

  // Filter and sort
  const filteredEntries = entries
    .filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesMood = selectedMood === 'all' || e.mood === selectedMood
      const matchesTag =
        selectedTag === 'all' || (Array.isArray(e.tags) && e.tags.includes(selectedTag))
      return matchesSearch && matchesMood && matchesTag
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB
    })

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Journal Timeline</h1>
          <p className="mt-1 text-sm text-slate-400">Search, filter, and review all your past entries</p>
        </div>
        <Link
          to="/journal/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> New Entry
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm md:grid-cols-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by title or content..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Mood Filter */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-10 pr-4 text-sm text-white focus:border-indigo-500 focus:outline-none appearance-none"
          >
            <option value="all">All Moods</option>
            <option value="happy">Happy 😊</option>
            <option value="calm">Calm 🌿</option>
            <option value="neutral">Neutral 😐</option>
            <option value="sad">Sad 🌧️</option>
            <option value="anxious">Anxious ⚡</option>
            <option value="energetic">Energetic 🚀</option>
          </select>
        </div>

        {/* Sort & Tag Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none appearance-none"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            title="Toggle sort order"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const moodMeta = MOOD_ICONS[entry.mood] || MOOD_ICONS.neutral
            return (
              <div
                key={entry.journalId}
                className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-slate-700 hover:bg-slate-800/50"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-semibold ${moodMeta.color}`}>
                      {moodMeta.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <Link
                    to={`/journal/${entry.journalId}`}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Read full entry →
                  </Link>
                </div>

                <Link to={`/journal/${entry.journalId}`}>
                  <h2 className="mt-3 text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {entry.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {entry.content}
                  </p>
                </Link>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-800/60">
                    {entry.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center text-slate-400">
          No entries matched your search criteria.
        </div>
      )}
    </div>
  )
}
