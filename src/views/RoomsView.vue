<template>
  <div class="rooms">
    <h1>Meeting Rooms</h1>
    
    <!-- Search filters -->
    <div class="filters">
      <div class="form-group">
        <label>Start Time (optional)</label>
        <input 
          type="datetime-local" 
          v-model="filters.startDateTime" 
          :min="currentDateTime"
          @change="resetSearch"
        >
      </div>
      <div class="form-group">
        <label>End Time (optional)</label>
        <input 
          type="datetime-local" 
          v-model="filters.endDateTime"
          :min="filters.startDateTime"
          @change="resetSearch"
        >
      </div>
      <div class="form-group">
        <label>Attendees (optional)</label>
        <input 
          type="number" 
          v-model="filters.attendees" 
          min="1" 
          @change="resetSearch"
        >
      </div>
      <button 
        class="search-button" 
        @click="searchRooms"
        :disabled="!isQueryValid"
      >
        {{ isSearchValid && (filters.startDateTime || filters.endDateTime || filters.attendees) 
          ? 'Search Available Rooms' 
          : 'List Rooms' }}
      </button>
    </div>

    <p v-if="rooms.length > 0 && !hasSearched" class="info-message">
      To book a room, please search with your time and attendee requirements first.
    </p>

    <!-- Rooms list -->
    <div class="rooms-grid">
      <div v-for="room in rooms" :key="room.meetingRoomId" class="room-card">
        <img v-if="room.photoUrl" :src="room.photoUrl" class="room-photo" alt="Room photo">
        <h3>{{ room.name }}</h3>
        <p class="room-number">Room: {{ room.roomNumber }}</p>
        <p class="capacity">Capacity: {{ room.capacity }} people</p>
        <p class="description">{{ room.description }}</p>
        <button 
          class="book-button" 
          @click="openBookingModal(room)"
          :disabled="!hasSearched"
        >
          {{ hasSearched ? 'Book Now' : 'Set time and attendees to book' }}
        </button>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="modal">
      <div class="modal-content">
        <h2>Book Room: {{ selectedRoom?.name }}</h2>
        <form @submit.prevent="handleBooking">
          <div class="form-group">
            <label>Meeting Subject</label>
            <input type="text" v-model="bookingForm.meetingSubject" required>
          </div>
          <div class="form-group">
            <label>Number of Attendees</label>
            <input 
              type="number" 
              v-model="bookingForm.attendees" 
              :max="selectedRoom?.capacity" 
              min="1" 
              required
            >
          </div>
          <div class="modal-actions">
            <button type="button" @click="showBookingModal = false">Cancel</button>
            <button type="submit" :disabled="isLoading">
              {{ isLoading ? 'Booking...' : 'Confirm Booking' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { searchMeetingRooms } from '@/api/meetingRoom'
import { createReservation } from '@/api/reservation'
import type { MeetingRoom } from '@/api/meetingRoom'
import type { Reservation } from '@/api/reservation'

const rooms = ref<MeetingRoom[]>([])
const selectedRoom = ref<MeetingRoom | null>(null)
const showBookingModal = ref(false)
const isLoading = ref(false)
const hasSearched = ref(false)

const currentDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

const filters = reactive({
  startDateTime: '',
  endDateTime: '', 
  attendees: null as number | null
})

const bookingForm = reactive({
  meetingSubject: '',
  attendees: 1
})

const isQueryValid = computed(() => {
  // do not allow incomplete time range
  if ((filters.startDateTime === '') !== (filters.endDateTime === '')) {
    return false
  }
  if (filters.startDateTime && filters.endDateTime && filters.startDateTime >= filters.endDateTime) {
    return false
  }
  if (filters.attendees && filters.attendees <= 0) {
    return false
  }
  return true
})


const isSearchValid = computed(() => {
  return filters.startDateTime && filters.endDateTime && filters.attendees && filters.attendees > 0 && filters.startDateTime < filters.endDateTime
})

async function searchRooms() {
  try {
    const searchParams: any = {}
    
    // Check if all criteria are set for a valid search
    const isValidSearch = filters.startDateTime && 
                         filters.endDateTime && 
                         filters.attendees && 
                         filters.attendees > 0 && 
                         filters.startDateTime < filters.endDateTime

    // Add any set criteria to search params
    if (filters.startDateTime) searchParams.startTime = filters.startDateTime
    if (filters.endDateTime) searchParams.endTime = filters.endDateTime
    if (filters.attendees) searchParams.attendees = filters.attendees
    // Only set hasSearched to true if it's a valid search
    hasSearched.value = !!isValidSearch

    rooms.value = await searchMeetingRooms(searchParams)
  } catch (error) {
    console.error('Failed to fetch rooms:', error)
  }
}

function resetSearch() {
  hasSearched.value = false
}

function openBookingModal(room: MeetingRoom) {
  if (!hasSearched.value) return
  selectedRoom.value = room
  bookingForm.attendees = filters.attendees ?? 1 // Ensure attendees is a number
  showBookingModal.value = true
}

async function handleBooking() {
  if (!selectedRoom.value) return
  
  isLoading.value = true
  try {
    const userId = parseInt(localStorage.getItem('userId') || '0')
    const reservation: Omit<Reservation, 'reservationId'> = {
      userId,
      meetingRoomId: selectedRoom.value.meetingRoomId,
      meetingSubject: bookingForm.meetingSubject,
      startTime: filters.startDateTime,
      endTime: filters.endDateTime,
      participantCount: bookingForm.attendees,
      status: 'PENDING'
    }
    
    await createReservation(reservation)
    showBookingModal.value = false
    await searchRooms() // Refresh rooms list
  } catch (error) {
    console.error('Failed to create booking:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(searchRooms)
</script>

<style scoped>
.rooms {
  padding: 2rem;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.room-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.room-card h3 {
  margin: 0 0 1rem;
  color: #2c3e50;
}

.room-number {
  color: #666;
  font-style: italic;
}

.capacity {
  font-weight: 500;
  color: #42b983;
}

.description {
  margin: 1rem 0;
  color: #2c3e50;
}

.book-button {
  width: 100%;
  padding: 0.75rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.book-button:disabled {
  background: #e0e0e0;
  color: #666;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-content h2 {
  margin: 0 0 1.5rem;
}

.modal-content textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button[type="button"] {
  background: #f8f9fa;
  border: 1px solid #ddd;
}

.modal-actions button[type="submit"] {
  background: #42b983;
  color: white;
  border: none;
}

.modal-actions button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.filters input[type="datetime-local"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.room-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  margin-bottom: 1rem;
}

.search-button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 38px;
  transition: background-color 0.2s;
}

.search-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.search-button:hover:not(:disabled) {
  background: #3aa876;
}

.search-message {
  text-align: center;
  color: #dc2626;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.info-message {
  text-align: center;
  color: #666;
  margin: 1rem 0;
  font-size: 0.9rem;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
}
</style> 