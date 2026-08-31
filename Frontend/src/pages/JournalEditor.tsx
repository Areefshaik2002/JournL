import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { journalAPI } from '../services/api'
import type { MoodType } from '../services/api'
import { ArrowLeft, Save, Tag as TagIcon } from 'lucide-react'

const MOOD_OPTIONS: { value: MoodType; label: string; icon: string }[] = [
  { value: 'happy', label: 'Happy', icon: '😊' },
  { value: 'calm', label: 'Calm', icon: '🌿' },
  { value: 'neutral', label: 'Neutral', icon: '😐' },
  { value: 'sad', label: 'Sad', icon: '🌧️' },
  { value: 'anxious', label: 'Anxious', icon: '⚡' },
  { value: 'energetic', label: 'Energetic', icon: '🚀' },
]

export const JournalEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id && id !== 'new')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<MoodType>('happy')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    if (isEditing && id) {
      const fetchEntry = async () => {
        try {
          const res = await journalAPI.getById(id)
          setTitle(res.data.title)
          setContent(res.data.content)
          setMood(res.data.mood)
          setTags(res.data.tags || [])
        } catch (err) {
          console.error('Error fetching entry for edit:', err)
          setError('Failed to load journal entry')
        } finally {
          setLoading(false)
        }
      }
      fetchEntry()
    }
  }, [id, isEditing])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty')
      return
    }

    setSaving(true)
    setError('')

    try {
      if (isEditing && id) {
        await journalAPI.update(id, { title, content, mood, tags })
        navigate(`/journal/${id}`)
      } else {
        const newEntry = await journalAPI.create({ title, content, mood, tags })
        navigate(`/journal/${newEntry.data.journalId}`)
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response
        setError(response?.data?.message || 'Failed to save entry')
      } else {
        setError('Failed to save entry')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Cancel
        </button>
        <h1 className="text-xl font-bold text-slate-900">
          {isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}
        </h1>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-sm font-medium text-rose-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry Title (e.g., A reflective morning walk)"
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-2xl font-bold text-slate-900 placeholder-slate-400 shadow-sm focus:border-rose-500 focus:outline-none"
          />
        </div>

        {/* Mood Selector */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            How are you feeling?
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
            {MOOD_OPTIONS.map((m) => (
              <button
                type="button"
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                  mood === m.value
                    ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tags
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <TagIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add a tag (e.g. mindfulness, work) and press Enter"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your journal thoughts here..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-800 placeholder-slate-400 shadow-sm focus:border-rose-500 focus:outline-none leading-relaxed"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-600 disabled:opacity-50 transition-all"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : isEditing ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  )
}
