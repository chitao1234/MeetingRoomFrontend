import api from './auth'

export interface MeetingRoom {
  meetingRoomId: number
  name: string
  capacity: number
  location: string
  description: string
  equipment: string
  status: string
}

export async function searchMeetingRooms(params: {
  attendees?: number
  startTime?: string
  endTime?: string
}): Promise<MeetingRoom[]> {
  const response = await api.get('/meeting-rooms', { params })
  return response.data
}

export async function getMeetingRoom(meetingRoomId: number): Promise<MeetingRoom> {
  const response = await api.get(`/meeting-rooms/${meetingRoomId}`)
  return response.data
}

export async function createMeetingRoom(roomData: Omit<MeetingRoom, 'meetingRoomId'>): Promise<MeetingRoom> {
  const response = await api.post('/meeting-rooms', roomData)
  return response.data
}

export async function updateMeetingRoom(
  meetingRoomId: number,
  roomData: Partial<MeetingRoom>
): Promise<MeetingRoom> {
  const response = await api.put(`/meeting-rooms/${meetingRoomId}`, roomData)
  return response.data
}

export async function deleteMeetingRoom(meetingRoomId: number): Promise<void> {
  await api.delete(`/meeting-rooms/${meetingRoomId}`)
} 