<template>
  <div class="container">
    <div class="card">
      <h2 class="text-center mb-4">Edit Profile</h2>
      
      <div class="profile-avatar mb-4">
        <img 
          :src="userForm.avatarUrl || xidian" 
          :alt="userForm.username"
          class="avatar-preview"
        />
        <input 
          type="file" 
          accept="image/*" 
          @change="handleAvatarChange" 
          class="hidden"
          ref="fileInput"
        />
        <button class="btn btn-secondary" @click="triggerFileInput">
          Change Avatar
        </button>
      </div>

      <form @submit.prevent="updateProfile" class="form-group">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="userForm.username" 
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="userForm.email" 
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="userForm.phone"
          />
        </div>

        <div class="flex gap-3 justify-center mt-4">
          <button type="submit" class="btn btn-primary">
            Save Changes
          </button>
          <router-link to="/" class="btn btn-secondary">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, updateUser } from '@/api/user'
import { uploadFile } from '@/api/file'
import type { User } from '@/api/user'
import xidian from '@/assets/xidian.png'

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)

const userForm = ref<Partial<User>>({
  username: '',
  email: '',
  phone: '',
  avatarUrl: ''
})

onMounted(async () => {
  try {
    const userId = parseInt(localStorage.getItem('userId') || '0')
    const userData = await getUser(userId)
    userForm.value = userData
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    try {
      const file = input.files[0]
      
      // Upload the file and get the URL
      const avatarUrl = await uploadFile(file, 'avatar')
      
      // Update the form and preview
      userForm.value.avatarUrl = avatarUrl
      
      // Clear the input
      input.value = ''
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      // You might want to show an error message to the user
    }
  }
}

const updateProfile = async () => {
  try {
    const userId = parseInt(localStorage.getItem('userId') || '0')
    await updateUser(userId, userForm.value)
    router.push('/')
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}
</script>

<style scoped>
.profile-avatar {
  text-align: center;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  box-shadow: var(--shadow);
}

.hidden {
  display: none;
}
</style> 