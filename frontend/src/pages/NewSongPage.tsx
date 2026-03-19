import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createSong } from '../api/songs'
import { toast } from 'sonner'

type FormState = {
  title: string
  artist_name: string
  genre: string
  bpm: string
  song_key: string
  date_written: string
}

const emptyForm: FormState = {
  title: '',
  artist_name: '',
  genre: '',
  bpm: '',
  song_key: '',
  date_written: '',
}

export default function NewSongPage() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createSong,
    onSuccess: (newSong) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      toast.success('Song created')
      navigate(`/songs/${newSong.id}`)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      title: form.title,
      artist_name: form.artist_name,
      genre: form.genre,
      bpm: Number(form.bpm),
      song_key: form.song_key,
      date_written: form.date_written || null,
    })
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">New Song</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Title', name: 'title', type: 'text', required: true },
          { label: 'Artist Name', name: 'artist_name', type: 'text', required: true },
          { label: 'Genre', name: 'genre', type: 'text', required: false },
          { label: 'BPM', name: 'bpm', type: 'number', required: false },
          { label: 'Key', name: 'song_key', type: 'text', required: false },
          { label: 'Date Written', name: 'date_written', type: 'date', required: false },
        ].map(({ label, name, type, required }) => (
          <div key={name}>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof FormState]}
              onChange={handleChange}
              required={required}
              placeholder={type === 'number' ? '0' : undefined}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        ))}

        {mutation.isError && (
          <p className="text-red-400 text-sm">
            {(mutation.error as any)?.response?.data?.error ?? 'Failed to create song. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors"
        >
          {mutation.isPending ? 'Saving...' : 'Create Song'}
        </button>
      </form>
    </div>
  )
}
