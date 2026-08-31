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
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            JournL
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/timeline"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/timeline')
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </Link>

          <Link
            to="/insights"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/insights')
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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

          <div className="ml-2 h-5 w-px bg-slate-200"></div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}
