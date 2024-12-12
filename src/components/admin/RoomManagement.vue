<template>
  <div class="mb-5">
    <div class="flex justify-between items-center mb-4">
      <h2>Room Management</h2>
      <button class="btn btn-primary" @click="$emit('showCreateModal')">Create Room</button>
    </div>
    
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
              <div class="flex gap-2">
                <button @click="$emit('edit', room)" class="btn btn-primary">Edit</button>
                <button @click="$emit('delete', room.meetingRoomId)" class="btn btn-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { MeetingRoom } from '@/api/meetingRoom'

export default defineComponent({
  name: 'RoomManagement',
  props: {
    rooms: {
      type: Array as () => MeetingRoom[],
      required: true
    }
  },
  emits: ['showCreateModal', 'edit', 'delete']
})
</script> 