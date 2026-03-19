import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCollaborator } from '../api/collaborators'
import type { CreateCollaboratorPayload } from '../types'
import { toast } from 'sonner'

interface Props {
  songId: number
}

type FormState = {
  name: string
  role: string
  ipi_number: string
  pro: string
  writer_split: string
  publisher_split: string
  master_split: string
  publisher_name: string
  publisher_ipi: string
}

const emptyForm: FormState = {
  name: '',
  role: '',
  ipi_number: '',
  pro: '',
  writer_split: '',
  publisher_split: '',
  master_split: '',
  publisher_name: '',
  publisher_ipi: '',
}

export default function AddCollaboratorForm({ songId }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateCollaboratorPayload) => createCollaborator(songId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators', songId] })
      queryClient.invalidateQueries({ queryKey: ['splits', songId] })
      setForm(emptyForm)
      setOpen(false)
      toast.success('Collaborator added')
    },
  })

  const splitFields = ['writer_split', 'publisher_split', 'master_split']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (splitFields.includes(name)) {
      const clamped = Math.min(100, Math.max(0, Number(value)))
      setForm((prev) => ({ ...prev, [name]: clamped === 0 && value === '' ? '' : String(clamped) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      ...form,
      writer_split: Number(form.writer_split),
      publisher_split: Number(form.publisher_split),
      master_split: Number(form.master_split),
      publisher_name: form.publisher_name,
      publisher_ipi: form.publisher_ipi,
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors"
      >
        + Add Collaborator
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-gray-900 border border-gray-800 rounded-lg p-5 space-y-4">
      <h3 className="text-sm font-medium text-gray-300">New Collaborator</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Name', name: 'name', type: 'text', required: true },
          { label: 'Role', name: 'role', type: 'text', required: true },
          { label: 'IPI Number', name: 'ipi_number', type: 'text', required: true },
          { label: 'PRO', name: 'pro', type: 'text', required: true },
          { label: 'Publisher Name', name: 'publisher_name', type: 'text', required: false },
          { label: 'Publisher IPI', name: 'publisher_ipi', type: 'text', required: false },
        ].map(({ label, name, type, required }) => (
          <div key={name}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof FormState]}
              onChange={handleChange}
              required={required}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Writer Split', name: 'writer_split' },
          { label: 'Publisher Split', name: 'publisher_split' },
          { label: 'Master Split', name: 'master_split' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <div className="relative">
              <input
                type="number"
                name={name}
                value={form[name as keyof FormState]}
                onChange={handleChange}
                min={0}
                max={100}
                placeholder="0"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-md pl-3 pr-8 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">%</span>
            </div>
          </div>
        ))}
      </div>

      {mutation.isError && (() => {
        const msg = (mutation.error as any)?.response?.data?.error ?? 'Something went wrong. Please try again.'
        const isOverflow = msg.includes('would exceed 100%')
        return (
          <div className="space-y-1">
            <p className="text-red-400 text-sm">{msg}</p>
            {isOverflow && (
              <p className="text-gray-500 text-xs">Edit an existing collaborator's splits to make room before adding.</p>
            )}
          </div>
        )
      })()}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-md transition-colors"
        >
          {mutation.isPending ? 'Saving...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
