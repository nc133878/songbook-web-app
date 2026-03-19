import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getSongs } from '../api/songs'
import Skeleton from '../components/Skeleton'

export default function SongsPage() {
  const { data: songs, isLoading, isError } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs,
  })

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-32 mb-6" />
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="bg-gray-900 border border-gray-800 rounded-lg px-5 py-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-20 text-center space-y-2">
        <p className="text-white font-medium">Could not load songs</p>
        <p className="text-sm text-gray-500">Make sure the backend is running and try refreshing.</p>
      </div>
    )
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-400 mb-4">No songs yet.</p>
        <Link
          to="/songs/new"
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add your first song
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Songs</h1>
      <ul className="space-y-3">
        {songs.map((song) => (
          <li key={song.id}>
            <Link
              to={`/songs/${song.id}`}
              className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg px-4 sm:px-5 py-4 transition-colors"
            >
              <div>
                <p className="font-medium text-white">{song.title}</p>
                <p className="text-sm text-gray-400">{song.artist_name}</p>
              </div>
              <div className="text-sm text-gray-500 text-right hidden sm:block">
                <p>{song.genre}</p>
                <p>{song.bpm} BPM · {song.song_key}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
