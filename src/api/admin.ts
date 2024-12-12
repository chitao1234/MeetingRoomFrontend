import api from './auth'
import type { User } from './user'
import type { MeetingRoom } from './meetingRoom'
import type { Reservation } from './reservation'

// User Management
export async function getAllUsers(): Promise<User[]> {
  const response = await api.get('/users')
  return response.data
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const response = await api.post('/users', userData)
  return response.data
}

export async function updateUser(userId: number, userData: Partial<User>): Promise<User> {
  const response = await api.put(`/users/${userId}`, userData)
  return response.data
}

export async function deleteUser(userId: number): Promise<void> {
  await api.delete(`/users/${userId}`)
}

// Room Management
export async function getAllRooms(): Promise<MeetingRoom[]> {
  const response = await api.get('/meeting-rooms')
  return response.data
}

export async function createRoom(roomData: Omit<MeetingRoom, 'meetingRoomId'>): Promise<MeetingRoom> {
  const response = await api.post('/meeting-rooms', roomData)
  return response.data
}

export async function updateRoom(roomId: number, roomData: Partial<MeetingRoom>): Promise<MeetingRoom> {
  const response = await api.put(`/meeting-rooms/${roomId}`, roomData)
  return response.data
}

export async function deleteRoom(roomId: number): Promise<void> {
  await api.delete(`/meeting-rooms/${roomId}`)
}

// Reservation Management
export async function getAllReservations(): Promise<Reservation[]> {
  const response = await api.get('/reservations')
  return response.data
}

export async function approveReservation(reservationId: number): Promise<Reservation> {
  const response = await api.post(`/reservations/${reservationId}/approve`)
  return response.data
}

export async function rejectReservation(reservationId: number, reason: string): Promise<Reservation> {
  const response = await api.post(`/reservations/${reservationId}/reject`, null, {
    params: { reason }
  })
  return response.data
}