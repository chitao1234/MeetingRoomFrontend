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
                <button @click="editUser(user)">Edit</button>
                <button @click="deleteUser(user.userId)" class="danger">Delete</button>
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
              <button type="submit">Create</button>
              <button type="button" class="danger" @click="showCreateUserModal = false">Cancel</button>
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
              <button type="submit">Save</button>
              <button type="button" class="danger" @click="showEditUserModal = false">Cancel</button>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in rooms" :key="room.meetingRoomId">
              <td>{{ room.meetingRoomId }}</td>
              <td>{{ room.name }}</td>
              <td>{{ room.capacity }}</td>
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
              <td>{{ reservation.userId }}</td>
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
                  @click="rejectReservation(reservation.reservationId)"
                  class="danger"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
      roomNumber: '',
      photoUrl: '',
      description: ''
    })
    const editingUser = ref<Partial<User>>({})
    const editingRoom = ref<Partial<MeetingRoom>>({})

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

    const rejectReservation = async (reservationId: number) => {
      const reason = prompt('Please enter a reason for rejection:')
      if (reason) {
        try {
          await adminApi.rejectReservation(reservationId, reason)
          await loadReservations()
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
        newRoom.value = { name: '', capacity: 0, roomNumber: '', photoUrl: '', description: '' }
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
      rejectReservation,
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
      saveRoomEdit
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

.admin-nav button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #e0e0e0;
  color: #333;
}

.admin-nav button.active {
  background: #2C7A2F;
  color: white;
}

.table-container {
  overflow-x: auto;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  min-width: 100px;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

button {
  padding: 6px 12px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #2C7A2F;
  color: white;
  font-weight: 500;
}

button.danger {
  background: #D32F2F;
}

button:hover {
  opacity: 0.9;
}

.create-btn {
  margin-bottom: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Add hover effect on table rows */
tbody tr:hover {
  background-color: #f9f9f9;
}

/* Ensure consistent button width in table */
td button {
  min-width: 80px;
  margin: 2px 4px;
}
</style> 