<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="form-group">
      <label for="room-name">Name:</label>
      <input id="room-name" v-model="formData.name" required />
    </div>
    <div class="form-group">
      <label for="room-capacity">Capacity:</label>
      <input id="room-capacity" v-model="formData.capacity" type="number" required />
    </div>
    <div class="form-group">
      <label for="room-area">Area (m²):</label>
      <input id="room-area" v-model="formData.area" type="number" min="0" step="0.1" />
    </div>
    <div class="form-group">
      <label for="room-number">Room Number:</label>
      <input id="room-number" v-model="formData.roomNumber" required />
    </div>
    <div class="form-group">
      <label for="room-photo">Photo URL:</label>
      <input id="room-photo" v-model="formData.photoUrl" type="url" />
    </div>
    <div class="form-group">
      <label for="room-description">Description:</label>
      <textarea id="room-description" v-model="formData.description"></textarea>
    </div>
    <div class="modal-actions">
      <button type="submit" class="btn btn-primary">{{ isEdit ? 'Save' : 'Create' }}</button>
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { MeetingRoom } from '@/api/meetingRoom'

export default defineComponent({
  name: 'RoomForm',
  props: {
    room: {
      type: Object as () => Partial<MeetingRoom>,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props) {
    const formData = ref({ ...props.room })

    return {
      formData
    }
  }
})
</script> 