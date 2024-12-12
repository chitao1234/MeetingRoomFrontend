<template>
  <div class="rooms">
    <h1>{{ $t('message.meetingRooms') }}</h1>
    
    <!-- Search filters -->
    <div class="filters">
      <div class="form-group">
        <label for="startTime">{{ $t('message.searchFilters.startTimeOptional') }}</label>
        <input 
          id="startTime"
          type="datetime-local" 
          v-model="filters.startDateTime" 
          :min="currentDateTime"
          @change="resetSearch"
        >
      </div>
      <div class="form-group">
        <label for="endTime">{{ $t('message.searchFilters.endTimeOptional') }}</label>
        <input 
          id="endTime"
          type="datetime-local" 
          v-model="filters.endDateTime"
          :min="filters.startDateTime"
          @change="resetSearch"
        >
      </div>
      <div class="form-group">
        <label for="attendees">{{ $t('message.searchFilters.attendeesOptional') }}</label>
        <input 
          id="attendees"
          type="number" 
          v-model="filters.attendees" 
          min="1" 
          @change="resetSearch"
        >
      </div>
      <button 
        class="form-group search-button" 
        @click="searchRooms"
        :disabled="!isQueryValid"
      >
        {{ isSearchValid && (filters.startDateTime || filters.endDateTime || filters.attendees) 
          ? $t('message.searchFilters.searchAvailableRooms') 
          : $t('message.searchFilters.listRooms') }}
      </button>
    </div>

    <p v-if="rooms.length > 0 && !hasSearched" class="info-message">
      {{ $t('message.searchInfo') }}
    </p>

    <!-- Rooms list -->
    <div class="rooms-grid">
      <div v-for="room in rooms" :key="room.meetingRoomId" class="room-card">
        <img v-if="room.photoUrl" :src="room.photoUrl" class="room-photo" alt="Room">
        <h3>{{ room.name }}</h3>
        <p class="room-number">{{ $t('message.roomDetails.room') }}: {{ room.roomNumber }}</p>
        <p class="capacity">{{ $t('message.roomDetails.capacity') }}: {{ room.capacity }} {{ $t('message.roomDetails.people') }}</p>
        <p class="area" v-if="room.area">{{ $t('message.roomDetails.size') }}: {{ room.area }} m²</p>
        
        <div class="description-container">
          <button class="toggle-description" @click="toggleDescription(room.meetingRoomId)">
            {{ expandedDescriptions[room.meetingRoomId] 
              ? $t('message.roomDetails.hideDetails') 
              : $t('message.roomDetails.showDetails') }}
          </button>
          <p class="description" v-show="expandedDescriptions[room.meetingRoomId]">
            {{ room.description }}
          </p>
        </div>

        <button 
          class="book-button" 
          @click="openBookingModal(room)"
          :disabled="!hasSearched"
        >
          {{ hasSearched 
            ? $t('message.roomDetails.bookNow') 
            : $t('message.roomDetails.setTimeAndAttendees') }}
        </button>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="modal">
      <div class="modal-content">
        <h2>{{ $t('message.bookingModal.bookRoom') }}: {{ selectedRoom?.name }}</h2>
        <form @submit.prevent="handleBooking">
          <div class="form-group">
            <label for="meetingSubject">{{ $t('message.bookingModal.meetingSubject') }}</label>
            <input id="meetingSubject" type="text" v-model="bookingForm.meetingSubject" required>
          </div>
          <div class="form-group">
            <label for="bookingAttendees">{{ $t('message.bookingModal.numberOfAttendees') }}</label>
            <input 
              id="bookingAttendees"
              type="number" 
              v-model="bookingForm.attendees" 
              :max="selectedRoom?.capacity" 
              min="1" 
              required
            >
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="showBookingModal = false">
              {{ $t('message.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading 
                ? $t('message.bookingModal.booking') 
                : $t('message.bookingModal.confirmBooking') }}
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
const expandedDescriptions = ref<{ [key: number]: boolean }>({})

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

function toggleDescription(roomId: number) {
  expandedDescriptions.value[roomId] = !expandedDescriptions.value[roomId]
}

onMounted(searchRooms)
</script>

<style scoped>
.rooms {
  padding: 2rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  align-items: flex-end;
}

.form-group {
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-color);
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.rooms-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.room-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.room-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.room-card h3 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.room-number {
  color: var(--text-light);
  font-style: italic;
}

.capacity {
  font-weight: 500;
  color: var(--primary-color);
}

.book-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.book-button:disabled {
  background: #e0e0e0;
  color: var(--text-light);
  cursor: not-allowed;
}

.search-button {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.search-button:hover:not(:disabled) {
  background: var(--primary-hover);
}

.search-message {
  text-align: center;
  color: var(--danger-color);
  margin: 1rem 0;
  font-size: 0.9rem;
}

.info-message {
  text-align: center;
  color: var(--text-light);
  margin: 1rem 0;
  font-size: 0.9rem;
  background: var(--background-light);
  padding: 0.5rem;
  border-radius: 4px;
}

.area {
  color: var(--text-light);
  margin: 0.5rem 0;
}

.description-container {
  margin: 1rem 0;
}

.toggle-description {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.toggle-description:hover {
  color: var(---text-light);
}

.description {
  margin: 0.5rem 0;
  color: var(--text-color);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .form-group {
    flex: 1;
  }

  .rooms-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}
</style> 