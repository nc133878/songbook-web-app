import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSong, deleteSong } from '../api/songs'
import { getCollaborators, deleteCollaborator, updateCollaborator } from '../api/collaborators'
import { validateSplits } from '../api/splits'
import AddCollaboratorForm from '../components/AddCollaboratorForm'
import DeleteSongModal from '../components/DeleteSongModal'
import Skeleton from '../components/Skeleton'

export default function SongDetailPage() {
  const { id } = useParams<{ id: string }>()
  const songId = Number(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmingCollabId, setConfirmingCollabId] = useState<number | null>(null)
  const [editingSplitsId, setEditingSplitsId] = useState<number | null>(null)
  const [editSplits, setEditSplits] = useState({ writer: '', publisher: '', master: '' })

  const songQuery = useQuery({
    queryKey: ['song', songId],
    queryFn: () => getSong(songId),
  })

  const collaboratorsQuery = useQuery({
    queryKey: ['collaborators', songId],
    queryFn: () => getCollaborators(songId),
  })

  const splitsQuery = useQuery({
    queryKey: ['splits', songId],
    queryFn: () => validateSplits(songId),
    enabled: (collaboratorsQuery.data?.length ?? 0) > 0,
  })

  const deleteMutation = useMutation({
    mutationFn: (collaboratorId: number) => deleteCollaborator(songId, collaboratorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators', songId] })
      queryClient.invalidateQueries({ queryKey: ['splits', songId] })
    },
  })

  const deleteSongMutation = useMutation({
    mutationFn: () => deleteSong(songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      navigate('/songs')
    },
  })

  const updateSplitsMutation = useMutation({
    mutationFn: ({ collabId, payload }: { collabId: number, payload: Parameters<typeof updateCollaborator>[2] }) =>
      updateCollaborator(songId, collabId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators', songId] })
      queryClient.invalidateQueries({ queryKey: ['splits', songId] })
      setEditingSplitsId(null)
    },
  })

  if (songQuery.isLoading) return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4 w-24" />)}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
  if (songQuery.isError) return (
    <div className="mt-20 text-center space-y-2">
      <p className="text-white font-medium">Song not found</p>
      <p className="text-sm text-gray-500">It may have been deleted or the backend is unreachable.</p>
    </div>
  )

  const song = songQuery.data!
  const collaborators = collaboratorsQuery.data ?? []
  const splits = splitsQuery.data

  return (
    <div className="space-y-8">

      {/* Song Info */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">{song.title}</h1>
            <p className="text-gray-400 mt-1">{song.artist_name}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={`/songs/${songId}/edit`}
              className="text-sm border border-amber-600 hover:border-amber-400 text-amber-500 hover:text-amber-300 px-4 py-2 rounded-md transition-colors"
            >
              Edit Song
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-sm border border-red-800 hover:border-red-600 text-red-500 hover:text-red-400 px-4 py-2 rounded-md transition-colors"
            >
              Delete
            </button>
            <div className="w-px h-5 bg-gray-700" />
            <Link
              to={`/songs/${songId}/split-sheet`}
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors whitespace-nowrap"
            >
              View Split Sheet →
            </Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
          <span>Genre: <span className="text-gray-200">{song.genre}</span></span>
          <span>BPM: <span className="text-gray-200">{song.bpm}</span></span>
          <span>Key: <span className="text-gray-200">{song.song_key}</span></span>
          <span>Written: <span className="text-gray-200">{song.date_written ? new Date(song.date_written).toLocaleDateString() : '—'}</span></span>
        </div>
      </div>

      {/* Split Validation */}
      {splits && (() => {
        const allValid = splits.writer_valid_100 && splits.publisher_valid_100 && splits.master_valid_100
        const invalid = [
          !splits.writer_valid_100 && `Writer splits total ${splits.writer_total}% (must be 100%)`,
          !splits.publisher_valid_100 && `Publisher splits total ${splits.publisher_total}% (must be 100%)`,
          !splits.master_valid_100 && `Master splits total ${splits.master_total}% (must be 100%)`,
        ].filter(Boolean) as string[]

        return (
          <div className={`rounded-lg px-5 py-4 border text-sm ${allValid ? 'bg-green-950 border-green-800 text-green-300' : 'bg-red-950 border-red-800 text-red-300'}`}>
            {allValid ? (
              <p>Splits are valid — Writer {splits.writer_total}% · Publisher {splits.publisher_total}% · Master {splits.master_total}%</p>
            ) : (
              <div>
                <p className="font-medium mb-1">Split errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {invalid.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
          </div>
        )
      })()}

      {/* Collaborators */}
      <div>
        <h2 className="text-lg font-medium text-white mb-3">Collaborators</h2>

        {collaboratorsQuery.isLoading && <p className="text-gray-400 text-sm">Loading collaborators...</p>}

        {collaborators.length === 0 && !collaboratorsQuery.isLoading && (
          <p className="text-gray-500 text-sm">No collaborators yet.</p>
        )}

        {deleteMutation.isError && (
          <p className="text-red-400 text-sm mt-2">
            {(deleteMutation.error as any)?.response?.data?.error ?? 'Failed to remove collaborator.'}
          </p>
        )}

        {collaborators.length > 0 && (
          <ul className="space-y-3">
            {collaborators.map((collab) => (
              <li
                key={collab.id}
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-white">{collab.name}</p>
                  <p className="text-sm text-gray-400">{collab.role} · {collab.pro} · IPI: {collab.ipi_number}</p>
                  {collab.publisher_name && (
                    <p className="text-sm text-gray-500">Publisher: {collab.publisher_name}{collab.publisher_ipi && ` · IPI: ${collab.publisher_ipi}`}</p>
                  )}
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  {editingSplitsId === collab.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {[
                          { label: 'W', key: 'writer' },
                          { label: 'P', key: 'publisher' },
                          { label: 'M', key: 'master' },
                        ].map(({ label, key }) => (
                          <div key={key} className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs">{label}</span>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={editSplits[key as keyof typeof editSplits]}
                                onChange={(e) => setEditSplits((prev) => ({ ...prev, [key]: e.target.value }))}
                                className="w-14 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {updateSplitsMutation.isError && (
                        <p className="text-red-400 text-xs">
                          {(updateSplitsMutation.error as any)?.response?.data?.error ?? 'Failed to update splits.'}
                        </p>
                      )}
                      <div className="flex gap-3 text-sm">
                        <button
                          onClick={() => updateSplitsMutation.mutate({
                            collabId: collab.id,
                            payload: {
                              name: collab.name,
                              role: collab.role,
                              ipi_number: collab.ipi_number,
                              pro: collab.pro,
                              publisher_name: collab.publisher_name,
                              publisher_ipi: collab.publisher_ipi,
                              writer_split: Number(editSplits.writer),
                              publisher_split: Number(editSplits.publisher),
                              master_split: Number(editSplits.master),
                            }
                          })}
                          disabled={updateSplitsMutation.isPending}
                          className="text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
                        >
                          {updateSplitsMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => { setEditingSplitsId(null); updateSplitsMutation.reset() }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-gray-400">W: {collab.writer_split}% · P: {collab.publisher_split}% · M: {collab.master_split}%</p>
                      <button
                        onClick={() => {
                          setEditingSplitsId(collab.id)
                          setEditSplits({
                            writer: String(collab.writer_split),
                            publisher: String(collab.publisher_split),
                            master: String(collab.master_split),
                          })
                          updateSplitsMutation.reset()
                        }}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Edit splits
                      </button>
                    </div>
                  )}

                  {confirmingCollabId === collab.id ? (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">Remove?</span>
                      <button
                        onClick={() => {
                          deleteMutation.mutate(collab.id)
                          setConfirmingCollabId(null)
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmingCollabId(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingCollabId(collab.id)}
                      className="text-sm text-red-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>

            ))}
          </ul>
        )}

        <AddCollaboratorForm songId={songId} />
      </div>

      {showDeleteModal && (
        <DeleteSongModal
          songTitle={song.title}
          isPending={deleteSongMutation.isPending}
          error={(deleteSongMutation.error as any)?.response?.data?.error ?? (deleteSongMutation.isError ? 'Failed to delete song.' : undefined)}
          onConfirm={() => deleteSongMutation.mutate()}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}
