<template>
  <div class="home">
    <h1>Welcome to Meeting Room Booking System</h1>
    <div class="stats-container">
      <router-link to="/bookings" class="card stat-card">
        <h3>Your Upcoming Bookings</h3>
        <div class="stat">{{ upcomingBookings.length }}</div>
      </router-link>
      <router-link to="/rooms" class="stat-card">
        <h3>Available Rooms</h3>
        <div class="stat">{{ availableRooms.length }}</div>
      </router-link>
      <router-link to="/bookings" class="stat-card">
        <h3>Total Bookings</h3>
        <div class="stat">{{ totalBookings }}</div>
      </router-link>
    </div>
    <div class="quick-actions">
      <router-link to="/rooms" class="action-button">Book a Room</router-link>
      <router-link to="/bookings" class="action-button">View My Bookings</router-link>
    </div>
    <NotificationList :userId="currentUser.userId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchMeetingRooms } from '@/api/meetingRoom'
import { getUserReservations } from '@/api/reservation'
import type { MeetingRoom } from '@/api/meetingRoom'
import type { Reservation } from '@/api/reservation'
import NotificationList from '@/components/NotificationList.vue'

const upcomingBookings = ref<Reservation[]>([])
const availableRooms = ref<MeetingRoom[]>([])
const totalBookings = ref(0)
const currentUser = ref({
  userId: parseInt(localStorage.getItem('userId') || '0')
})

onMounted(async () => {
  try {
    // Get current user ID from auth store/local storage
    const userId = parseInt(localStorage.getItem('userId') || '0')
    
    // Get current date and time
    const now = new Date()
    const startTime = now.toISOString()
    const endTime = new Date(now.setHours(23, 59, 59)).toISOString()

    // Fetch data in parallel
    const [rooms, reservations] = await Promise.all([
      searchMeetingRooms({ startTime, endTime }),
      getUserReservations(userId)
    ])

    availableRooms.value = rooms
    
    // Filter upcoming bookings (those that haven't ended yet)
    upcomingBookings.value = reservations.filter(
      reservation => new Date(reservation.endTime) > now
    )
    
    totalBookings.value = reservations.length
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
})
</script>

<style scoped>
.home {
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.stat {
  font-size: 2.5rem;
  font-weight: bold;
  color: #42b983;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #3aa876;
}

@media (min-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .quick-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style> 