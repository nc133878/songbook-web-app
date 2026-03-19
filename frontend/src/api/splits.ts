import api from './client'
import type { SplitSheet, SplitValidation } from '../types'

export const getSplitSheet = async (songId: number): Promise<SplitSheet> => {
  const { data } = await api.get(`/songs/${songId}/split-sheet`)
  return data
}

export const validateSplits = async (songId: number): Promise<SplitValidation> => {
  const { data } = await api.get(`/songs/${songId}/splits/validate`)
  return data
}
