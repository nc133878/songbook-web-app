import api from './client'
import type { Song, CreateSongPayload } from '../types'

export const getSongs = async (): Promise<Song[]> => {
  const { data } = await api.get('/songs')
  return data
}

export const getSong = async (id: number): Promise<Song> => {
  const { data } = await api.get(`/songs/id/${id}`)
  return data
}

export const createSong = async (payload: CreateSongPayload): Promise<Song> => {
  const { data } = await api.post('/songs', payload)
  return data
}

export const updateSong = async (id: number, payload: CreateSongPayload): Promise<Song> => {
  const { data } = await api.put(`/songs/id/${id}`, payload)
  return data
}

export const deleteSong = async (id: number): Promise<void> => {
  await api.delete(`/songs/id/${id}`)
}
