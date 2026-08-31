import React, { useEffect, useState } from 'react'
import { dashboardAPI } from '../services/api'
import type { DashboardData } from '../services/api'
import { Flame, Tag, BarChart3, Smile } from 'lucide-react'

export const Insights: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await dashboardAPI.getSummary()
        setData(res.data)
      } catch (err) {
        console.error('Error loading insights:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    )
  }

  const totalMoods = Object.values(data?.moodCounts || {}).reduce((a, b) => a + b, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Journaling Insights & Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Visualize your mood trends, tags, and writing habits</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Mood Distribution */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Smile className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mood Distribution</h2>
              <p className="text-xs text-slate-500">Frequency of recorded moods</p>
            </div>
          </div>

          {totalMoods > 0 ? (
            <div className="space-y-4">
              {Object.entries(data?.moodCounts || {}).map(([mood, count]) => {
                const percentage = Math.round((count / totalMoods) * 100)
                return (
                  <div key={mood} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="capitalize text-slate-700">{mood}</span>
                      <span className="text-slate-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">
              No mood data recorded yet.
            </div>
          )}
        </div>

        {/* Most Used Tags */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Most Used Tags</h2>
              <p className="text-xs text-slate-500">Top topics in your journal entries</p>
            </div>
          </div>

          {Object.keys(data?.tagCounts || {}).length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(data?.tagCounts || {})
                .sort(([, a], [, b]) => b - a)
                .map(([tag, count]) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700"
                  >
                    <span>#{tag}</span>
                    <span className="rounded-md bg-indigo-200/60 px-2 py-0.5 text-xs text-indigo-800">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">
              No tags added to journal entries yet.
            </div>
          )}
        </div>
      </div>

      {/* Summary Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Flame className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Current Streak: {data?.streak || 0} Days</h3>
            <p className="text-sm text-slate-500">Keep writing daily to maintain your reflective habit!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600">
          <BarChart3 className="h-6 w-6" /> {data?.totalEntries || 0} Total Entries
        </div>
      </div>
    </div>
  )
}
