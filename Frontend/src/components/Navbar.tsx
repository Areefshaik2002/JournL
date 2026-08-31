import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  BookOpen,
  LayoutDashboard,
  Clock,
  PieChart,
  PlusCircle,
  LogOut,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) return null

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            JournL
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/dashboard')
                ? 'bg-slate-800 text-indigo-400'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/timeline"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/timeline')
                ? 'bg-slate-800 text-indigo-400'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </Link>

          <Link
            to="/insights"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/insights')
                ? 'bg-slate-800 text-indigo-400'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </Link>

          <Link
            to="/journal/new"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Entry</span>
          </Link>

          <div className="ml-2 h-5 w-px bg-slate-800"></div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}
