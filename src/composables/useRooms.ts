import { ref } from 'vue'
import * as adminApi from '@/api/admin'
import type { MeetingRoom } from '@/api/meetingRoom'

export function useRooms() {
  const rooms = ref<MeetingRoom[]>([])

  const loadRooms = async () => {
    try {
      rooms.value = await adminApi.getAllRooms()
    } catch (error) {
      console.error('Failed to load rooms:', error)
    }
  }

  const createRoom = async (roomData: Omit<MeetingRoom, 'meetingRoomId'>) => {
    try {
      await adminApi.createRoom(roomData)
      await loadRooms()
      return true
    } catch (error) {
      console.error('Failed to create room:', error)
      return false
    }
  }

  const updateRoom = async (roomId: number, roomData: Partial<MeetingRoom>) => {
    try {
      await adminApi.updateRoom(roomId, roomData)
      await loadRooms()
      return true
    } catch (error) {
      console.error('Failed to update room:', error)
      return false
    }
  }

  const deleteRoom = async (roomId: number) => {
    try {
      await adminApi.deleteRoom(roomId)
      await loadRooms()
      return true
    } catch (error) {
      console.error('Failed to delete room:', error)
      return false
    }
  }

  return {
    rooms,
    loadRooms,
    createRoom,
    updateRoom,
    deleteRoom
  }
} 