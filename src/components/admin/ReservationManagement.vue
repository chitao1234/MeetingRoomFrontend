<template>
  <div class="mb-5">
    <h2 class="mb-4">Reservations</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room</th>
            <th>User</th>
            <th>Subject</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation.reservationId">
            <td>{{ reservation.reservationId }}</td>
            <td>{{ reservation.meetingRoomId }}</td>
            <td>{{ getUserName(reservation.userId) }}</td>
            <td>{{ reservation.meetingSubject }}</td>
            <td>{{ formatDateTime(reservation.startTime) }}</td>
            <td>{{ formatDateTime(reservation.endTime) }}</td>
            <td>
              <span :class="['status-badge', reservation.status.toLowerCase()]">
                {{ reservation.status }}
              </span>
            </td>
            <td>
              <div class="flex gap-2" v-if="reservation.status === 'PENDING'">
                <button 
                  class="btn btn-primary"
                  @click="$emit('approve', reservation.reservationId)"
                >
                  Approve
                </button>
                <button 
                  class="btn btn-danger"
                  @click="$emit('reject', reservation.reservationId)"
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatDateTime } from '@/utils/dateTime'
import type { Reservation } from '@/api/reservation'

export default defineComponent({
  name: 'ReservationManagement',
  props: {
    reservations: {
      type: Array as () => Reservation[],
      required: true
    },
    getUserName: {
      type: Function as PropType<(userId: number) => string>,
      required: true
    }
  },
  emits: ['approve', 'reject'],
  setup() {
    return {
      formatDateTime
    }
  }
})
</script> 