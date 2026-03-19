import api from './client'
import type { Collaborator, CreateCollaboratorPayload } from '../types'

export const getCollaborators = async (songId: number): Promise<Collaborator[]> => {
  const { data } = await api.get(`/songs/${songId}/collaborators`)
  return data
}

export const createCollaborator = async (
  songId: number,
  payload: CreateCollaboratorPayload
): Promise<Collaborator> => {
  const { data } = await api.post(`/songs/${songId}/collaborators`, payload)
  return data
}

export const updateCollaborator = async (
  songId: number,
  collaboratorId: number,
  payload: CreateCollaboratorPayload
): Promise<Collaborator> => {
  const { data } = await api.put(`/songs/${songId}/collaborators/${collaboratorId}`, payload)
  return data
}

export const deleteCollaborator = async (songId: number, collaboratorId: number): Promise<void> => {
  await api.delete(`/songs/${songId}/collaborators/${collaboratorId}`)
}
