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
            <p>
              <strong>Date:</strong> 
              {{ new Date(booking.startTime).toLocaleDateString() }}
            </p>
            <p>
              <strong>Time:</strong>
              {{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}
            </p>
          </div>
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
import type { Reservation } from '@/api/reservation'

const bookings = ref<Reservation[]>([])
const selectedStatus = ref('ALL')

// Filter bookings based on selected status
const filteredBookings = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return bookings.value
  }
  return bookings.value.filter(booking => booking.status === selectedStatus.value)
})

// Format time from ISO string to readable format
function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load user's bookings
async function loadBookings() {
  try {
    const userId = parseInt(localStorage.getItem('userId') || '0')
    bookings.value = await getUserReservations(userId)
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
  flex-wrap: wrap;  /* Allow wrapping on mobile */
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-button {
  flex: 1 1 auto;  /* Allow buttons to grow and shrink */
  min-width: 80px;
  text-align: center;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  color: #2c3e50;
}

.filter-button:hover {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.filter-button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.bookings-list {
  display: grid;
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.booking-header {
  flex-direction: column;  /* Stack elements on mobile */
  gap: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.booking-header h3 {
  margin: 0;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.booking-details {
  margin-bottom: 1.5rem;
}

.time-details {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.rejection-reason {
  color: #991b1b;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.booking-actions {
  display: flex;
  justify-content: flex-end;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background: #dc2626;
}

@media (min-width: 768px) {
  .booking-header {
    flex-direction: row;  /* Side by side on desktop */
    justify-content: space-between;
    align-items: center;
  }

  .filter-button {
    flex: 0 1 auto;  /* Don't grow on desktop */
  }
}
</style> 