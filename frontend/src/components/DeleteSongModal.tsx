import { useState } from 'react'

interface Props {
  songTitle: string
  isPending: boolean
  error?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteSongModal({ songTitle, isPending, error, onConfirm, onCancel }: Props) {
  const [input, setInput] = useState('')
  const confirmed = input === songTitle

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 space-y-5 shadow-xl">
        <div>
          <h2 className="text-lg font-semibold text-white">Delete song</h2>
          <p className="text-sm text-gray-400 mt-2">
            This will permanently delete <span className="text-white font-medium">{songTitle}</span> and all of its collaborators. This action cannot be undone.
          </p>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Type <span className="text-white font-mono">{songTitle}</span> to confirm
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={songTitle}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={!confirmed || isPending}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-md transition-colors"
          >
            {isPending ? 'Deleting...' : 'Delete this song'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
