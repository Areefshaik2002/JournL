import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export interface User {
  userId: string
  name: string
  email: string
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

export interface DashboardData {
  totalEntries: number
  hasWrittenToday: boolean
  streak: number
  recentEntries: JournalEntry[]
  moodCounts: Record<string, number>
  tagCounts: Record<string, number>
}

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    API.post<{ user: User; token: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    API.post<{ user: User; token: string }>('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get<User>('/auth/me'),
}

export const journalAPI = {
  getAll: () => API.get<JournalEntry[]>('/journals'),
  getById: (id: string) => API.get<JournalEntry>(`/journals/${id}`),
  create: (data: { title: string; content: string; mood: MoodType; tags: string[] }) =>
    API.post<JournalEntry>('/journals', data),
  update: (id: string, data: { title: string; content: string; mood: MoodType; tags: string[] }) =>
    API.put<JournalEntry>(`/journals/${id}`, data),
  delete: (id: string) => API.delete<{ message: string }>(`/journals/${id}`),
}

export const dashboardAPI = {
  getSummary: () => API.get<DashboardData>('/dashboard'),
}

export default API