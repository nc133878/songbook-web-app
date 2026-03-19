import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      authLogin(data.token, data.user)
      navigate('/songs')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Sign in to Songbook</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome back.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm">Invalid email or password.</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-2 rounded-md transition-colors"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300">
            Sign up
          </Link>
        </p>

        <div className="border border-gray-800 rounded-lg px-4 py-3 space-y-1">
          <p className="text-xs uppercase tracking-widest text-gray-500">Demo account</p>
          <p className="text-sm text-gray-400">Email: <span className="text-gray-200 font-mono">demo@songbook.app</span></p>
          <p className="text-sm text-gray-400">Password: <span className="text-gray-200 font-mono">demo1234</span></p>
        </div>
      </div>
    </div>
  )
}
