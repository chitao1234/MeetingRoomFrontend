<template>
  <div class="admin-page">
    <h1>Admin Dashboard</h1>
    
    <!-- User Management Section -->
    <div class="section" v-if="activeSection === 'users'">
      <h2>User Management</h2>
      <button class="create-btn" @click="showCreateUserModal = true">Create User</button>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.userId">
              <td>{{ user.userId }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button @click="editUser(user)" class="btn btn-primary">Edit</button>
                <button @click="deleteUser(user.userId)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Create User Modal -->
      <div v-if="showCreateUserModal" class="modal">
        <div class="modal-content">
          <h3>Create User</h3>
          <form @submit.prevent="createNewUser">
            <div class="form-group">
              <label for="username">Username:</label>
              <input id="username" v-model="newUser.username" required />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input id="password" v-model="newUser.password" type="password" required />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input id="email" v-model="newUser.email" type="email" required />
            </div>
            <div class="form-group">
              <label for="phone">Phone:</label>
              <input id="phone" v-model="newUser.phone" />
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <select id="role" v-model="newUser.role">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary">Create</button>
              <button type="button" class="btn btn-secondary" @click="showCreateUserModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
      <!-- Edit User Modal -->
      <div v-if="showEditUserModal" class="modal">
        <div class="modal-content">
          <h3>Edit User</h3>
          <form @submit.prevent="saveUserEdit">
            <div class="form-group">
              <label for="edit-username">Username:</label>
              <input id="edit-username" v-model="editingUser.username" required />
            </div>
            <div class="form-group">
              <label for="edit-email">Email:</label>
              <input id="edit-email" v-model="editingUser.email" type="email" required />
            </div>
            <div class="form-group">
              <label for="edit-phone">Phone:</label>
              <input id="edit-phone" v-model="editingUser.phone" />
            </div>
            <div class="form-group">
              <label for="edit-role">Role:</label>
              <select id="edit-role" v-model="editingUser.role">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" @click="showEditUserModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Room Management Section -->
    <div class="section" v-if="activeSection === 'rooms'">
      <h2>Room Management</h2>
      <button class="create-btn" @click="showCreateRoomModal = true">Create Room</button>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Capacity</th>
              <th>Area (m²)</th>
              <th>Room Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in rooms" :key="room.meetingRoomId">
              <td>{{ room.meetingRoomId }}</td>
              <td>{{ room.name }}</td>
              <td>{{ room.capacity }}</td>
              <td>{{ room.area || '-' }}</td>
              <td>{{ room.roomNumber }}</td>
              <td>
                <button @click="editRoom(room)">Edit</button>
                <button @click="deleteRoom(room.meetingRoomId)" class="danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Create Room Modal -->
      <div v-if="showCreateRoomModal" class="modal">
        <div class="modal-content">
          <h3>Create Room</h3>
          <form @submit.prevent="createNewRoom">
            <div class="form-group">
              <label for="room-name">Name:</label>
              <input id="room-name" v-model="newRoom.name" required />
            </div>
            <div class="form-group">
              <label for="room-capacity">Capacity:</label>
              <input id="room-capacity" v-model="newRoom.capacity" type="number" required />
            </div>
            <div class="form-group">
              <label for="room-area">Area (m²):</label>
              <input id="room-area" v-model="newRoom.area" type="number" min="0" step="0.1" />
            </div>
            <div class="form-group">
              <label for="room-number">Room Number:</label>
              <input id="room-number" v-model="newRoom.roomNumber" required />
            </div>
            <div class="form-group">
              <label for="room-photo">Photo URL:</label>
              <input id="room-photo" v-model="newRoom.photoUrl" type="url" />
            </div>
            <div class="form-group">
              <label for="room-description">Description:</label>
              <textarea id="room-description" v-model="newRoom.description"></textarea>
            </div>
            <div class="modal-actions">
              <button type="submit">Create</button>
              <button type="button" class="danger" @click="showCreateRoomModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
      <!-- Edit Room Modal -->
      <div v-if="showEditRoomModal" class="modal">
        <div class="modal-content">
          <h3>Edit Room</h3>
          <form @submit.prevent="saveRoomEdit">
            <div class="form-group">
              <label for="edit-room-name">Name:</label>
              <input id="edit-room-name" v-model="editingRoom.name" required />
            </div>
            <div class="form-group">
              <label for="edit-room-capacity">Capacity:</label>
              <input id="edit-room-capacity" v-model="editingRoom.capacity" type="number" required />
            </div>
            <div class="form-group">
              <label for="edit-room-area">Area (m²):</label>
              <input id="edit-room-area" v-model="editingRoom.area" type="number" min="0" step="0.1" />
            </div>
            <div class="form-group">
              <label for="edit-room-number">Room Number:</label>
              <input id="edit-room-number" v-model="editingRoom.roomNumber" required />
            </div>
            <div class="form-group">
              <label for="edit-room-photo">Photo URL:</label>
              <input id="edit-room-photo" v-model="editingRoom.photoUrl" type="url" />
            </div>
            <div class="form-group">
              <label for="edit-room-description">Description:</label>
              <textarea id="edit-room-description" v-model="editingRoom.description"></textarea>
            </div>
            <div class="modal-actions">
              <button type="submit">Save</button>
              <button type="button" class="danger" @click="showEditRoomModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Reservation Management Section -->
    <div class="section" v-if="activeSection === 'reservations'">
      <h2>Reservations</h2>
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
              <td>{{ reservation.status }}</td>
              <td>
                <button 
                  v-if="reservation.status === 'PENDING'"
                  @click="approveReservation(reservation.reservationId)"
                >
                  Approve
                </button>
                <button 
                  v-if="reservation.status === 'PENDING'"
                  @click="openRejectModal(reservation.reservationId)"
                  class="danger"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Reject Reservation Modal -->
      <div v-if="showRejectModal" class="modal">
        <div class="modal-content">
          <h3>Reject Reservation</h3>
          <form @submit.prevent="submitRejectReservation">
            <div class="form-group">
              <label for="reject-reason">Rejection Reason:</label>
              <textarea 
                id="reject-reason" 
                v-model="rejectReason" 
                required
                rows="3"
                placeholder="Please provide a reason for rejection"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="submit">Confirm Reject</button>
              <button type="button" class="danger" @click="showRejectModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="admin-nav">
      <button 
        @click="activeSection = 'users'"
        :class="{ active: activeSection === 'users' }"
      >
        Users
      </button>
      <button 
        @click="activeSection = 'rooms'"
        :class="{ active: activeSection === 'rooms' }"
      >
        Rooms
      </button>
      <button 
        @click="activeSection = 'reservations'"
        :class="{ active: activeSection === 'reservations' }"
      >
        Reservations
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import * as adminApi from '@/api/admin'
import { formatDateTime } from '@/utils/dateTime'
import type { User } from '@/api/user'
import type { MeetingRoom } from '@/api/meetingRoom'
import type { Reservation } from '@/api/reservation'

export default defineComponent({
  name: 'AdminView',
  setup() {
    const activeSection = ref('users')
    const users = ref<User[]>([])
    const rooms = ref<MeetingRoom[]>([])
    const reservations = ref<Reservation[]>([])
    const showCreateUserModal = ref(false)
    const showCreateRoomModal = ref(false)
    const showEditUserModal = ref(false)
    const showEditRoomModal = ref(false)
    const showRejectModal = ref(false)
    const newUser = ref({
      username: '',
      password: '',
      email: '',
      phone: '',
      role: 'USER'
    })
    const newRoom = ref({
      name: '',
      capacity: 0,
      area: undefined as number | undefined,
      roomNumber: '',
      photoUrl: '',
      description: ''
    })
    const editingUser = ref<Partial<User>>({})
    const editingRoom = ref<Partial<MeetingRoom>>({})
    const rejectReason = ref('')
    const rejectingReservationId = ref<number | null>(null)

    const loadUsers = async () => {
      try {
        users.value = await adminApi.getAllUsers()
      } catch (error) {
        console.error('Failed to load users:', error)
      }
    }

    const loadRooms = async () => {
      try {
        rooms.value = await adminApi.getAllRooms()
      } catch (error) {
        console.error('Failed to load rooms:', error)
      }
    }

    const loadReservations = async () => {
      try {
        reservations.value = await adminApi.getAllReservations()
      } catch (error) {
        console.error('Failed to load reservations:', error)
      }
    }

    const deleteUser = async (userId: number) => {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await adminApi.deleteUser(userId)
          await loadUsers()
        } catch (error) {
          console.error('Failed to delete user:', error)
        }
      }
    }

    const deleteRoom = async (roomId: number) => {
      if (confirm('Are you sure you want to delete this room?')) {
        try {
          await adminApi.deleteRoom(roomId)
          await loadRooms()
        } catch (error) {
          console.error('Failed to delete room:', error)
        }
      }
    }

    const editRoom = (room: MeetingRoom) => {
      editingRoom.value = { ...room }
      showEditRoomModal.value = true
    }

    const editUser = (user: User) => {
      editingUser.value = { ...user }
      showEditUserModal.value = true
    }

    const approveReservation = async (reservationId: number) => {
      try {
        await adminApi.approveReservation(reservationId)
        await loadReservations()
      } catch (error) {
        console.error('Failed to approve reservation:', error)
      }
    }

    const openRejectModal = (reservationId: number) => {
      rejectingReservationId.value = reservationId
      rejectReason.value = ''
      showRejectModal.value = true
    }

    const submitRejectReservation = async () => {
      if (rejectingReservationId.value && rejectReason.value) {
        try {
          await adminApi.rejectReservation(rejectingReservationId.value, rejectReason.value)
          await loadReservations()
          showRejectModal.value = false
          rejectingReservationId.value = null
          rejectReason.value = ''
        } catch (error) {
          console.error('Failed to reject reservation:', error)
        }
      }
    }

    const createNewUser = async () => {
      try {
        await adminApi.createUser(newUser.value)
        showCreateUserModal.value = false
        await loadUsers()
        newUser.value = { username: '', password: '', email: '', phone: '', role: 'USER' }
      } catch (error) {
        console.error('Failed to create user:', error)
      }
    }

    const createNewRoom = async () => {
      try {
        await adminApi.createRoom(newRoom.value)
        showCreateRoomModal.value = false
        await loadRooms()
        newRoom.value = { name: '', capacity: 0, area: undefined, roomNumber: '', photoUrl: '', description: '' }
      } catch (error) {
        console.error('Failed to create room:', error)
      }
    }

    const saveUserEdit = async () => {
      try {
        await adminApi.updateUser(editingUser.value.userId!, editingUser.value)
        showEditUserModal.value = false
        await loadUsers()
      } catch (error) {
        console.error('Failed to update user:', error)
      }
    }

    const saveRoomEdit = async () => {
      try {
        await adminApi.updateRoom(editingRoom.value.meetingRoomId!, editingRoom.value)
        showEditRoomModal.value = false
        await loadRooms()
      } catch (error) {
        console.error('Failed to update room:', error)
      }
    }

    const getUserName = (userId: number): string => {
      const user = users.value.find(u => u.userId === userId)
      return user ? user.username : `User ${userId}`
    }

    onMounted(() => {
      loadUsers()
      loadRooms()
      loadReservations()
    })

    return {
      activeSection,
      users,
      rooms,
      reservations,
      deleteUser,
      deleteRoom,
      editRoom,
      editUser,
      approveReservation,
      openRejectModal,
      formatDateTime,
      showCreateUserModal,
      showCreateRoomModal,
      newUser,
      newRoom,
      createNewUser,
      createNewRoom,
      showEditUserModal,
      showEditRoomModal,
      editingUser,
      editingRoom,
      saveUserEdit,
      saveRoomEdit,
      getUserName,
      showRejectModal,
      rejectReason,
      submitRejectReservation,
    }
  }
})
</script>

<style scoped>
.admin-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-nav {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.create-btn {
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .admin-nav button {
    flex: 0 1 auto;
  }
}
</style> 