import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { journalAPI } from '../services/api'
import type { JournalEntry } from '../services/api'
import { ArrowLeft, Edit3, Trash2, Calendar, Clock, Tag } from 'lucide-react'

const MOOD_ICONS: Record<string, { label: string; color: string }> = {
  happy: { label: 'Happy 😊', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  calm: { label: 'Calm 🌿', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  neutral: { label: 'Neutral 😐', color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
  sad: { label: 'Sad 🌧️', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  anxious: { label: 'Anxious ⚡', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  energetic: { label: 'Energetic 🚀', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
}

export const JournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      const fetchEntry = async () => {
        try {
          const res = await journalAPI.getById(id)
          setEntry(res.data)
        } catch (err) {
          console.error('Error fetching journal:', err)
          setError('Journal entry not found')
        } finally {
          setLoading(false)
        }
      }
      fetchEntry()
    }
  }, [id])

  const handleDelete = async () => {
    if (!id) return
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      setDeleting(true)
      try {
        await journalAPI.delete(id)
        navigate('/timeline')
      } catch (err) {
        console.error('Error deleting entry:', err)
        alert('Failed to delete journal entry')
        setDeleting(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-slate-400">
        <p className="text-lg">{error || 'Entry not found'}</p>
        <Link to="/timeline" className="mt-4 inline-block text-sm font-semibold text-indigo-400 hover:underline">
          Return to Timeline
        </Link>
      </div>
    )
  }

  const moodMeta = MOOD_ICONS[entry.mood] || MOOD_ICONS.neutral

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/timeline')}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Timeline
        </button>

        <div className="flex items-center gap-3">
          <Link
            to={`/journal/edit/${entry.journalId}`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Main Journal Display */}
      <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-semibold ${moodMeta.color}`}>
              {moodMeta.label}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>
                {new Date(entry.createdAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {entry.updatedAt !== entry.createdAt && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" /> Updated
              </div>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight">
            {entry.title}
          </h1>
        </div>

        <div className="prose prose-invert max-w-none text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-800">
            {entry.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                <Tag className="h-3 w-3 text-slate-500" /> #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
