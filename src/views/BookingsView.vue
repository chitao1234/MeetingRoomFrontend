<template>
  <div class="bookings">
    <h1>My Bookings</h1>
    
    <!-- Booking filters -->
    <div class="filters">
      <button 
        v-for="status in ['ALL', 'PENDING', 'APPROVED', 'REJECTED']" 
        :key="status"
        :class="['filter-button', { active: selectedStatus === status }]"
        @click="selectedStatus = status"
      >
        {{ status }}
      </button>
    </div>

    <!-- Bookings list -->
    <div class="bookings-list">
      <div v-for="booking in filteredBookings" :key="booking.reservationId" class="card">
        <div class="booking-header">
          <h3>{{ booking.meetingSubject }}</h3>
          <span :class="['status-badge', booking.status.toLowerCase()]">
            {{ booking.status }}
          </span>
        </div>
        
        <div class="booking-details">
          <div class="time-details">
            <template v-if="isDifferentDay(booking.startTime, booking.endTime)">
              <p>
                <strong>Start:</strong> 
                {{ formatDateTime(booking.startTime, true) }}
              </p>
              <p>
                <strong>End:</strong>
                {{ formatDateTime(booking.endTime, true) }}
              </p>
            </template>
            <template v-else>
              <p>
                <strong>Date:</strong> 
                {{ new Date(booking.startTime).toLocaleDateString() }}
              </p>
              <p>
                <strong>Time:</strong>
                {{ formatDateTime(booking.startTime) }} - {{ formatDateTime(booking.endTime) }}
              </p>
            </template>
          </div>
          <p><strong>Room:</strong> {{ booking.roomNumber }}</p>
          <p><strong>Attendees:</strong> {{ booking.participantCount }}</p>
          <p v-if="booking.rejectionReason" class="rejection-reason">
            <strong>Rejection Reason:</strong> {{ booking.rejectionReason }}
          </p>
        </div>

        <div class="booking-actions">
          <button 
            v-if="booking.status === 'PENDING'"
            class="btn btn-danger"
            @click="cancelBooking(booking.reservationId)"
          >
            Cancel Booking
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
  if (!confirm('Are you sure you want to cancel this booking?')) return
  
  try {
    await deleteReservation(reservationId)
    await loadBookings() // Refresh the list
  } catch (error) {
    console.error('Failed to cancel booking:', error)
  }
}

onMounted(loadBookings)
</script>

<style scoped>
.bookings {
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.bookings-list {
  display: grid;
  gap: 1.5rem;
}

.booking-header {
  flex-direction: column;
  gap: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.booking-details {
  margin-bottom: 1.5rem;
}

.time-details {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .booking-header {
    flex-direction: row;
  }
}
</style> 