import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSplitSheet } from '../api/splits'

const SECTIONS = [
  { key: 'writer', label: 'Writer Share' },
  { key: 'publishing', label: 'Publishing Share' },
  { key: 'master', label: 'Master Share' },
] as const

type SectionKey = typeof SECTIONS[number]['key']

export default function SplitSheetPage() {
  const { id } = useParams<{ id: string }>()
  const songId = Number(id)

  const [selected, setSelected] = useState<Set<SectionKey>>(
    new Set(['writer', 'publishing', 'master'])
  )

  const { data, isLoading, isError } = useQuery({
    queryKey: ['split-sheet', songId],
    queryFn: () => getSplitSheet(songId),
  })

  const toggleSection = (key: SectionKey) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const pdfUrl = `/songs/${songId}/split-sheet/pdf?sections=${[...selected].join(',')}`

  if (isLoading) return <p className="text-gray-400">Loading split sheet...</p>
  if (isError) return (
    <div className="mt-20 text-center space-y-2">
      <p className="text-white font-medium">Could not load split sheet</p>
      <p className="text-sm text-gray-500">Make sure the backend is running and try refreshing.</p>
    </div>
  )

  const { song, collaborators, totals, validation } = data!
  const collabList = collaborators ?? []
  const { writer_total, publisher_total, master_total } = totals

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Split Sheet</p>
          <h1 className="text-2xl font-semibold text-white">{song.title}</h1>
          <p className="text-gray-400 mt-1">{song.artist_name}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm px-4 py-2 rounded-md transition-colors ${selected.size === 0 ? 'bg-gray-700 text-gray-500 pointer-events-none' : 'bg-violet-600 hover:bg-violet-500 text-white'}`}
          >
            Open as PDF
          </Link>
          <Link
            to={`/songs/${songId}`}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            ← Back to Song
          </Link>
        </div>
      </div>

      {/* PDF Section Selector */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-gray-900 border border-gray-800 rounded-lg px-5 py-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 w-full sm:w-auto">Include in PDF</p>
        {SECTIONS.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.has(key)}
              onChange={() => toggleSection(key)}
              className="accent-violet-500 w-4 h-4"
            />
            <span className="text-sm text-gray-300">{label}</span>
          </label>
        ))}
      </div>

      {/* Song Meta */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 border-t border-gray-800 pt-6">
        <span>Genre: <span className="text-gray-200">{song.genre}</span></span>
        <span>BPM: <span className="text-gray-200">{song.bpm}</span></span>
        <span>Key: <span className="text-gray-200">{song.song_key}</span></span>
        <span>Date Written: <span className="text-gray-200">{song.date_written ? new Date(song.date_written).toLocaleDateString() : '—'}</span></span>
      </div>

      {/* Split Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-gray-500 border-b border-gray-800">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Role</th>
              <th className="pb-3 pr-4 font-medium">PRO</th>
              <th className="pb-3 pr-4 font-medium">IPI</th>
              <th className="pb-3 pr-4 font-medium text-right">Writer %</th>
              <th className="pb-3 pr-4 font-medium text-right">Publisher %</th>
              <th className="pb-3 font-medium text-right">Master %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {collabList.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500 text-sm">No collaborators added yet.</td>
              </tr>
            )}
            {collabList.map((collab) => (
              <tr key={collab.id} className="text-gray-300">
                <td className="py-3 pr-4 text-white font-medium">{collab.name}</td>
                <td className="py-3 pr-4">{collab.role}</td>
                <td className="py-3 pr-4">{collab.pro}</td>
                <td className="py-3 pr-4">{collab.ipi_number}</td>
                <td className="py-3 pr-4 text-right">{collab.writer_split}%</td>
                <td className="py-3 pr-4 text-right">{collab.publisher_split}%</td>
                <td className="py-3 text-right">{collab.master_split}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-700 text-white font-semibold">
              <td colSpan={4} className="pt-4 text-gray-400 font-normal text-xs uppercase tracking-widest">Totals</td>
              <td className="pt-4 text-right">{writer_total}%</td>
              <td className="pt-4 text-right">{publisher_total}%</td>
              <td className="pt-4 text-right">{master_total}%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Validity Footer */}
      <div className="border-t border-gray-800 pt-6 text-xs">
        {validation.writer_valid_100 && validation.publisher_valid_100 && validation.master_valid_100 ? (
          <p className="text-green-400">All splits verified at 100%</p>
        ) : (
          <p className="text-red-400">Warning: one or more split totals do not equal 100%</p>
        )}
      </div>

    </div>
  )
}
