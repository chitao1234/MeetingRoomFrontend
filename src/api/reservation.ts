import api from './auth'

export interface Reservation {
  reservationId: number
  userId: number
  meetingRoomId: number
  meetingSubject: string
  startTime: string
  endTime: string
  participantCount: number
  status: string
  rejectionReason?: string
  createdTime?: string
  updatedTime?: string
  approvalTime?: string
}

export async function getReservation(reservationId: number): Promise<Reservation> {
  const response = await api.get(`/reservations/${reservationId}`)
  return response.data
}

export async function getUserReservations(userId: number): Promise<Reservation[]> {
  const response = await api.get(`/reservations/user/${userId}`)
  return response.data
}

export async function getRoomReservations(
  meetingRoomId: number,
  params?: {
    startDateTime?: string
    endDateTime?: string
  }
): Promise<Reservation[]> {
  const response = await api.get(`/reservations/room/${meetingRoomId}`, { params })
  return response.data
}

export async function createReservation(reservation: Omit<Reservation, 'reservationId'>): Promise<Reservation> {
  const response = await api.post('/reservations/create', reservation)
  return response.data
}

export async function updateReservation(
  reservationId: number,
  reservation: Partial<Reservation>
): Promise<Reservation> {
  const response = await api.put(`/reservations/${reservationId}`, reservation)
  return response.data
}

export async function deleteReservation(reservationId: number): Promise<void> {
  await api.delete(`/reservations/${reservationId}`)
}

export async function approveReservation(reservationId: number): Promise<Reservation> {
  const response = await api.post(`/reservations/${reservationId}/approve`)
  return response.data
}

export async function rejectReservation(
  reservationId: number,
  reason: string
): Promise<Reservation> {
  const response = await api.post(`/reservations/${reservationId}/reject`, null, {
    params: { reason }
  })
  return response.data
} 