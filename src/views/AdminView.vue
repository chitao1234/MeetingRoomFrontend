<template>
  <div class="container p-4">
    <!-- Navigation -->
    <nav class="status-filters mb-4">
      <button 
        v-for="section in sections"
        :key="section.value"
        @click="activeSection = section.value"
        :class="['status-btn', activeSection === section.value ? 'active' : '']"
      >
        {{ section.label }}
      </button>
    </nav>

    <h1 class="mb-4">Admin Dashboard</h1>
    
    <!-- Section Components -->
    <UserManagement
      v-if="activeSection === 'users'"
      :users="users"
      @showCreateModal="showCreateUserModal = true"
      @edit="handleEditUser"
      @delete="deleteUser"
    />

    <RoomManagement
      v-if="activeSection === 'rooms'"
      :rooms="rooms"
      @showCreateModal="showCreateRoomModal = true"
      @edit="handleEditRoom"
      @delete="deleteRoom"
    />

    <ReservationManagement
      v-if="activeSection === 'reservations'"
      :reservations="reservations"
      :getUserName="getUserName"
      @approve="approveReservation"
      @reject="openRejectModal"
    />

    <LogManagement
      v-if="activeSection === 'logs'"
      :logs="logs"
      :getUserName="getUserName"
      @cleanup="openCleanupModal"
      @filterDate="filterLogsByDate"
      @filterType="filterLogsByType"
    />

    <!-- Modals -->
    <BaseModal
      :show="showCreateUserModal"
      title="Create User"
      @close="showCreateUserModal = false"
    >
      <UserForm
        :user="newUser"
        @submit="handleCreateUser"
        @cancel="showCreateUserModal = false"
      />
    </BaseModal>

    <BaseModal
      :show="showEditUserModal"
      title="Edit User"
      @close="showEditUserModal = false"
    >
      <UserForm
        :user="editingUser"
        :isEdit="true"
        @submit="handleSaveUserEdit"
        @cancel="showEditUserModal = false"
      />
    </BaseModal>

    <!-- Room Modals -->
    <BaseModal
      :show="showCreateRoomModal"
      title="Create Room"
      @close="showCreateRoomModal = false"
    >
      <RoomForm
        :room="newRoom"
        @submit="handleCreateRoom"
        @cancel="showCreateRoomModal = false"
      />
    </BaseModal>

    <BaseModal
      :show="showEditRoomModal"
      title="Edit Room"
      @close="showEditRoomModal = false"
    >
      <RoomForm
        :room="editingRoom"
        :isEdit="true"
        @submit="handleSaveRoomEdit"
        @cancel="showEditRoomModal = false"
      />
    </BaseModal>

    <!-- Reject Reservation Modal -->
    <BaseModal
      :show="showRejectModal"
      title="Reject Reservation"
      @close="showRejectModal = false"
    >
      <div class="form-group">
        <label for="reject-reason">Rejection Reason:</label>
        <textarea
          id="reject-reason"
          v-model="rejectReason"
          required
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>
      <div class="modal-actions">
        <button @click="handleRejectReservation" class="btn btn-danger">Confirm Reject</button>
        <button @click="showRejectModal = false" class="btn btn-secondary">Cancel</button>
      </div>
    </BaseModal>

    <!-- Cleanup Logs Modal -->
    <BaseModal
      :show="showCleanupModal"
      title="Cleanup Old Logs"
      @close="showCleanupModal = false"
    >
      <div class="form-group">
        <label for="days-to-keep">Days to Keep:</label>
        <input 
          id="days-to-keep" 
          v-model="daysToKeep" 
          type="number" 
          min="1" 
          class="form-input"
        />
      </div>
      <div class="modal-actions">
        <button @click="handleCleanupLogs" class="btn btn-danger">Confirm Cleanup</button>
        <button @click="showCleanupModal = false" class="btn btn-secondary">Cancel</button>
      </div>
    </BaseModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import RoomManagement from '@/components/admin/RoomManagement.vue'
import ReservationManagement from '@/components/admin/ReservationManagement.vue'
import LogManagement from '@/components/admin/LogManagement.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import UserForm from '@/components/admin/UserForm.vue'
import RoomForm from '@/components/admin/RoomForm.vue'
import { useUsers } from '@/composables/useUsers'
import { useRooms } from '@/composables/useRooms'
import { useReservations } from '@/composables/useReservations'
import { useLogs } from '@/composables/useLogs'
import { formatDateTime } from '@/utils/dateTime'

export default defineComponent({
  name: 'AdminView',
  components: {
    UserManagement,
    RoomManagement,
    ReservationManagement,
    LogManagement,
    BaseModal,
    UserForm,
    RoomForm
  },
  setup() {
    const sections = [
      { value: 'users', label: 'Users' },
      { value: 'rooms', label: 'Rooms' },
      { value: 'reservations', label: 'Reservations' },
      { value: 'logs', label: 'Logs' }
    ]

    const activeSection = ref('users')
    const { users, loadUsers, createUser, updateUser, deleteUser } = useUsers()
    const { rooms, loadRooms, createRoom, updateRoom, deleteRoom } = useRooms()
    const { 
      reservations, 
      loadReservations, 
      approveReservation, 
      rejectReservation 
    } = useReservations()
    const {
      logs,
      loadLogs,
      filterByDateRange,
      filterByType,
      cleanupOldLogs
    } = useLogs()

    // Modal states
    const showCreateUserModal = ref(false)
    const showEditUserModal = ref(false)
    const showCreateRoomModal = ref(false)
    const showEditRoomModal = ref(false)
    const showRejectModal = ref(false)
    const showCleanupModal = ref(false)

    // Form data
    const newUser = ref({
      username: '',
      password: '',
      email: '',
      phone: '',
      role: 'USER'
    })
    const editingUser = ref({})
    const newRoom = ref({
      name: '',
      capacity: 0,
      area: undefined,
      roomNumber: '',
      photoUrl: '',
      description: ''
    })
    const editingRoom = ref({})
    const rejectReason = ref('')
    const rejectingReservationId = ref<number | null>(null)
    const daysToKeep = ref(30)

    // User actions
    const handleCreateUser = async (userData: any) => {
      if (await createUser(userData)) {
        showCreateUserModal.value = false
      }
    }

    const handleEditUser = (user: any) => {
      editingUser.value = { ...user }
      showEditUserModal.value = true
    }

    const handleSaveUserEdit = async (userData: any) => {
      if (await updateUser(userData.userId, userData)) {
        showEditUserModal.value = false
      }
    }

    // Room actions
    const handleCreateRoom = async (roomData: any) => {
      if (await createRoom(roomData)) {
        showCreateRoomModal.value = false
      }
    }

    const handleEditRoom = (room: any) => {
      editingRoom.value = { ...room }
      showEditRoomModal.value = true
    }

    const handleSaveRoomEdit = async (roomData: any) => {
      if (await updateRoom(roomData.meetingRoomId, roomData)) {
        showEditRoomModal.value = false
      }
    }

    // Reservation actions
    const openRejectModal = (reservationId: number) => {
      rejectingReservationId.value = reservationId
      rejectReason.value = ''
      showRejectModal.value = true
    }

    const handleRejectReservation = async () => {
      if (rejectingReservationId.value && rejectReason.value) {
        if (await rejectReservation(rejectingReservationId.value, rejectReason.value)) {
          showRejectModal.value = false
          rejectingReservationId.value = null
          rejectReason.value = ''
        }
      }
    }

    // Log actions
    const openCleanupModal = () => {
      showCleanupModal.value = true
    }

    const filterLogsByDate = async (filters: any) => {
      await filterByDateRange(filters.startDate, filters.endDate)
    }

    const filterLogsByType = async (operationType: string) => {
      await filterByType(operationType)
    }

    const handleCleanupLogs = async () => {
      if (await cleanupOldLogs(daysToKeep.value)) {
        showCleanupModal.value = false
      }
    }

    // Utility functions
    const getUserName = (userId: number): string => {
      const user = users.value.find(u => u.userId === userId)
      return user ? user.username : `User ${userId}`
    }

    onMounted(() => {
      loadUsers()
      loadRooms()
      loadReservations()
      loadLogs()
    })

    return {
      sections,
      activeSection,
      users,
      rooms,
      reservations,
      logs,
      showCreateUserModal,
      showEditUserModal,
      showCreateRoomModal,
      showEditRoomModal,
      showRejectModal,
      showCleanupModal,
      newUser,
      editingUser,
      newRoom,
      editingRoom,
      rejectReason,
      daysToKeep,
      handleCreateUser,
      handleEditUser,
      handleSaveUserEdit,
      handleCreateRoom,
      handleEditRoom,
      handleSaveRoomEdit,
      handleRejectReservation,
      handleCleanupLogs,
      getUserName,
      formatDateTime,
      approveReservation,
      deleteUser,
      deleteRoom,
      openRejectModal,
      openCleanupModal,
      filterLogsByDate,
      filterLogsByType,
    }
  }
})
</script> 