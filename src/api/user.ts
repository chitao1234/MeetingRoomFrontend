import api from './auth'

export interface User {
  userId: number
  username: string
  email: string
  phone?: string
  role: string
  lastLoginTime?: string
  createdTime?: string
  updatedTime?: string
  avatarUrl?: string
}

export async function getAllUsers(): Promise<User[]> {
  const response = await api.get('/users')
  return response.data
}

export async function getUser(userId: number): Promise<User> {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

export async function getUserByUsername(username: string): Promise<User> {
  const response = await api.get(`/users/username/${username}`)
  return response.data
}

export async function updateUser(userId: number, userData: Partial<User>): Promise<User> {
  const response = await api.put(`/users/${userId}`, userData)
  return response.data
}

export async function deleteUser(userId: number): Promise<void> {
  await api.delete(`/users/${userId}`)
} 