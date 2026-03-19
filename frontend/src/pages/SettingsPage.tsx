import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password updated')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
  })

  const mismatch = newPassword !== confirmPassword && confirmPassword !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mismatch) return
    mutation.mutate()
  }

  return (
    <div className="max-w-md space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-300 mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full bg-gray-900 border rounded-md px-3 py-2 text-white focus:outline-none ${mismatch ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-violet-500'}`}
            />
            {mismatch && <p className="text-red-400 text-xs mt-1">Passwords do not match</p>}
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm">
              {(mutation.error as any)?.response?.data?.error === 'incorrect current password'
                ? 'Current password is incorrect.'
                : (mutation.error as any)?.response?.data?.error ?? 'Failed to update password. Please try again.'}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending || mismatch || !currentPassword || !newPassword}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-md transition-colors"
          >
            {mutation.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
