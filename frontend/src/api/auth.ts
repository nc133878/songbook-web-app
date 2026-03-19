import api from './client'
import type { AuthResponse } from '../types'

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', { email, password })
  return data
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await api.put('/auth/change-password', { current_password: currentPassword, new_password: newPassword })
}
