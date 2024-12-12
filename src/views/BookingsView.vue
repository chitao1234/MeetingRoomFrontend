<template>
  <div class="container p-4">
    <h1 class="mb-4">{{ $t('message.myBookings') }}</h1>
    
    <!-- Booking filters -->
    <div class="status-filters mb-4">
      <button 
        v-for="status in ['all', 'pending', 'approved', 'rejected']" 
        :key="status"
        :class="['status-btn', selectedStatus === status.toUpperCase() ? 'active' : '']"
        @click="selectedStatus = status.toUpperCase()"
      >
        {{ $t(`message.status.${status}`) }}
      </button>
    </div>

    <!-- Bookings list -->
    <div class="grid gap-4">
      <div v-for="booking in filteredBookings" :key="booking.reservationId" class="card">
        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
          <h3 class="mb-2 md:mb-0">{{ booking.meetingSubject }}</h3>
          <span :class="['status-badge', booking.status.toLowerCase()]">
            {{ $t(`message.status.${booking.status.toLowerCase()}`) }}
          </span>
        </div>
        
        <div class="mb-4">
          <div class="grid gap-2 mb-3">
            <template v-if="isDifferentDay(booking.startTime, booking.endTime)">
              <p>
                <strong>{{ $t('message.bookingDetails.start') }}:</strong> 
                {{ formatDateTime(booking.startTime, true) }}
              </p>
              <p>
                <strong>{{ $t('message.bookingDetails.end') }}:</strong>
                {{ formatDateTime(booking.endTime, true) }}
              </p>
            </template>
            <template v-else>
              <p>
                <strong>{{ $t('message.bookingDetails.date') }}:</strong> 
                {{ new Date(booking.startTime).toLocaleDateString() }}
              </p>
              <p>
                <strong>{{ $t('message.bookingDetails.time') }}:</strong>
                {{ formatDateTime(booking.startTime) }} - {{ formatDateTime(booking.endTime) }}
              </p>
            </template>
          </div>
          <p class="mb-2">
            <strong>{{ $t('message.bookingDetails.room') }}:</strong> 
            {{ booking.roomNumber }}
          </p>
          <p class="mb-2">
            <strong>{{ $t('message.bookingDetails.attendees') }}:</strong> 
            {{ booking.participantCount }}
          </p>
          <p v-if="booking.rejectionReason" class="error mb-2">
            <strong>{{ $t('message.bookingDetails.rejectionReason') }}:</strong> 
            {{ booking.rejectionReason }}
          </p>
        </div>

        <div class="flex justify-end">
          <button 
            v-if="booking.status === 'PENDING'"
            class="btn btn-danger"
            @click="cancelBooking(booking.reservationId)"
          >
            {{ $t('message.cancelBooking') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getUserReservations, deleteReservation } from '@/api/reservation'
import { getMeetingRoom } from '@/api/meetingRoom'
import type { Reservation } from '@/api/reservation'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Add interface for room info
interface BookingWithRoom extends Reservation {
  roomNumber?: string;
}

const bookings = ref<BookingWithRoom[]>([])
const selectedStatus = ref('ALL')

// Filter bookings based on selected status
const filteredBookings = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return bookings.value
  }
  return bookings.value.filter(booking => booking.status === selectedStatus.value)
})

// Add this function to check if dates are different
function isDifferentDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.toDateString() !== d2.toDateString()
}

// Update the formatTime function
function formatDateTime(isoString: string, includeDate: boolean = false): string {
  const date = new Date(isoString)
  const timeStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
  if (includeDate) {
    return `${date.toLocaleDateString()} ${timeStr}`
  }
  return timeStr
}

// Load user's bookings
async function loadBookings() {
  try {
    const userId = parseInt(localStorage.getItem('userId') || '0')
    const reservations = await getUserReservations(userId)
    
    // Fetch room details for each booking
    const bookingsWithRooms = await Promise.all(
      reservations.map(async (booking) => {
        try {
          const room = await getMeetingRoom(booking.meetingRoomId)
          return {
            ...booking,
            roomNumber: room.roomNumber
          }
        } catch (error) {
          console.error(`Failed to load room details for booking ${booking.reservationId}:`, error)
          return {
            ...booking,
            roomNumber: 'Unknown'
          }
        }
      })
    )

    bookings.value = bookingsWithRooms
    // Sort by start time, most recent first
    bookings.value.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
  } catch (error) {
    console.error('Failed to load bookings:', error)
  }
}

// Cancel a booking
async function cancelBooking(reservationId: number) {
  if (!confirm(t('message.confirmCancel'))) return
  
  try {
    await deleteReservation(reservationId)
    await loadBookings()
  } catch (error) {
    console.error('Failed to cancel booking:', error)
  }
}

onMounted(loadBookings)
</script> 