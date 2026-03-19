import { Link, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/songs" className="text-xl font-semibold tracking-tight text-white">
          Songbook
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
          <Link
            to="/songs/new"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-3 sm:px-4 py-2 rounded-md transition-colors"
          >
            + New Song
          </Link>
          <Link
            to="/settings"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  )
}
