<template>
  <div class="mb-5">
    <h2 class="mb-4">{{ $t('message.management.reservationList') }}</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('message.roomDetails.room') }}</th>
            <th>{{ $t('message.users') }}</th>
            <th>{{ $t('message.bookingDetails.subject') }}</th>
            <th>{{ $t('message.startTime') }}</th>
            <th>{{ $t('message.endTime') }}</th>
            <th>{{ $t('message.status') }}</th>
            <th>{{ $t('message.management.actions') }}</th>
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
                {{ $t(`message.status.${reservation.status.toLowerCase()}`) }}
              </span>
            </td>
            <td>
              <div class="flex gap-2" v-if="reservation.status === 'PENDING'">
                <button 
                  class="btn btn-primary"
                  @click="$emit('approve', reservation.reservationId)"
                >
                  {{ $t('message.management.approve') }}
                </button>
                <button 
                  class="btn btn-danger"
                  @click="$emit('reject', reservation.reservationId)"
                >
                  {{ $t('message.management.reject') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { formatDateTime } from '@/utils/dateTime'
import type { Reservation } from '@/api/reservation'

defineProps({
  reservations: {
    type: Array as PropType<Reservation[]>,
    required: true
  },
  getUserName: {
    type: Function as PropType<(userId: number) => string>,
    required: true
  }
})
</script> 