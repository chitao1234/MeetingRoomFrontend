<template>
  <div class="mb-5">
    <div class="flex justify-between items-center mb-4">
      <h2>{{ $t('message.management.roomList') }}</h2>
      <button class="btn btn-primary" @click="$emit('showCreateModal')">
        {{ $t('message.management.createNew') }}
      </button>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('message.forms.roomName') }}</th>
            <th>{{ $t('message.forms.capacity') }}</th>
            <th>{{ $t('message.forms.area') }}</th>
            <th>{{ $t('message.forms.roomNumber') }}</th>
            <th>{{ $t('message.management.actions') }}</th>
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
                <button @click="$emit('edit', room)" class="btn btn-primary">
                  {{ $t('message.edit') }}
                </button>
                <button @click="$emit('delete', room.meetingRoomId)" class="btn btn-danger">
                  {{ $t('message.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { MeetingRoom } from '@/api/meetingRoom'

defineProps<{
  rooms: MeetingRoom[]
}>()
</script> 