export interface User {
  id: number
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Song {
  id: number
  title: string
  artist_name: string
  genre: string
  bpm: number
  song_key: string
  date_written: string | null
}

export interface CreateSongPayload {
  title: string
  artist_name: string
  genre: string
  bpm: number
  song_key: string
  date_written: string | null
}

export interface Collaborator {
  id: number
  song_id: number
  name: string
  role: string
  ipi_number: string
  pro: string
  writer_split: number
  publisher_split: number
  master_split: number
  publisher_name: string
  publisher_ipi: string
}

export interface CreateCollaboratorPayload {
  name: string
  role: string
  ipi_number: string
  pro: string
  writer_split: number
  publisher_split: number
  master_split: number
  publisher_name: string
  publisher_ipi: string
}

export interface SplitSheet {
  song: Song
  collaborators: Collaborator[]
  totals: {
    writer_total: number
    publisher_total: number
    master_total: number
  }
  validation: {
    writer_valid_100: boolean
    publisher_valid_100: boolean
    master_valid_100: boolean
  }
}

export interface SplitValidation {
  song_id: number
  writer_total: number
  writer_remaining: number
  writer_valid_100: boolean
  publisher_total: number
  publisher_remaining: number
  publisher_valid_100: boolean
  master_total: number
  master_remaining: number
  master_valid_100: boolean
}
