import { ref } from 'vue'
import * as adminApi from '@/api/admin'
import type { Reservation } from '@/api/reservation'

export function useReservations() {
  const reservations = ref<Reservation[]>([])

  const loadReservations = async () => {
    try {
      reservations.value = await adminApi.getAllReservations()
    } catch (error) {
      console.error('Failed to load reservations:', error)
    }
  }

  const approveReservation = async (reservationId: number) => {
    try {
      await adminApi.approveReservation(reservationId)
      await loadReservations()
      return true
    } catch (error) {
      console.error('Failed to approve reservation:', error)
      return false
    }
  }

  const rejectReservation = async (reservationId: number, reason: string) => {
    try {
      await adminApi.rejectReservation(reservationId, reason)
      await loadReservations()
      return true
    } catch (error) {
      console.error('Failed to reject reservation:', error)
      return false
    }
  }

  return {
    reservations,
    loadReservations,
    approveReservation,
    rejectReservation
  }
} 