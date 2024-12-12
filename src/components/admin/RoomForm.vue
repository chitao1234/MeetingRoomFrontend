<template>
  <form @submit.prevent="handleSubmit" class="card">
    <div class="form-group">
      <label for="room-name">Name:</label>
      <input 
        id="room-name" 
        v-model="formData.name" 
        required 
        class="form-control"
      />
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
      <label for="room-photo">Photo:</label>
      <div class="photo-upload card p-3">
        <input 
          type="file" 
          id="room-photo" 
          @change="handleFileChange" 
          accept="image/jpeg,image/png,image/gif,image/webp"
          class="hidden"
          ref="fileInput"
        />
        <div class="preview-container">
          <img 
            v-if="formData.photoUrl" 
            :src="formData.photoUrl" 
            alt="Room preview" 
            class="preview-image"
          />
          <div v-else class="placeholder text-center">
            <span class="text-light">No image selected</span>
          </div>
        </div>
        <div class="upload-actions mt-3">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="triggerFileInput"
          >
            {{ formData.photoUrl ? 'Change Photo' : 'Upload Photo' }}
          </button>
          <button 
            v-if="formData.photoUrl" 
            type="button" 
            class="btn btn-danger" 
            @click="removePhoto"
          >
            Remove
          </button>
        </div>
        <p v-if="uploadError" class="error-message mt-2">{{ uploadError }}</p>
      </div>
    </div>
    <div class="form-group">
      <label for="room-description">Description:</label>
      <textarea id="room-description" v-model="formData.description"></textarea>
    </div>
    <div class="modal-actions">
      <button type="submit" class="btn btn-primary" :disabled="isUploading">
        {{ isEdit ? 'Save' : 'Create' }}
      </button>
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { MeetingRoom } from '@/api/meetingRoom'
import { uploadFile } from '@/api/file'

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
  setup(props, { emit }) {
    const formData = ref({ ...props.room })
    const uploadError = ref('')
    const isUploading = ref(false)
    const fileInput = ref<HTMLInputElement | null>(null)

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileChange = async (event: Event) => {
      const input = event.target as HTMLInputElement
      if (!input.files?.length) return

      const file = input.files[0]
      uploadError.value = ''
      isUploading.value = true

      try {
        const url = await uploadFile(file, 'room')
        formData.value.photoUrl = url
      } catch (error) {
        uploadError.value = error instanceof Error ? error.message : 'Failed to upload image'
      } finally {
        isUploading.value = false
      }
    }

    const removePhoto = () => {
      formData.value.photoUrl = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const handleSubmit = () => {
      emit('submit', formData.value)
    }

    return {
      formData,
      uploadError,
      isUploading,
      fileInput,
      triggerFileInput,
      handleFileChange,
      removePhoto,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.preview-container {
  width: 200px;
  height: 150px;
  border: 2px dashed var(--border-color);
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message {
  color: var(--danger-color);
}

.hidden {
  display: none;
}
</style> 