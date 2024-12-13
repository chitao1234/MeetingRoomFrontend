<template>
  <div class="container">
    <div class="card">
      <h2 class="text-center mb-4">{{ $t('message.editProfile') }}</h2>
      
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
          {{ $t('message.changeAvatar') }}
        </button>
      </div>

      <form @submit.prevent="updateProfile" class="form-group">
        <div class="form-group">
          <label for="username">{{ $t('message.username') }}</label>
          <input 
            type="text" 
            id="username" 
            v-model="userForm.username" 
            required
          />
        </div>

        <div class="form-group">
          <label for="email">{{ $t('message.email') }}</label>
          <input 
            type="email" 
            id="email" 
            v-model="userForm.email" 
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">{{ $t('message.phone') }}</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="userForm.phone"
          />
        </div>

        <div class="form-group mt-4">
          <h3 class="text-center mb-3">{{ $t('message.changePassword') }}</h3>
          
          <div class="form-group">
            <label for="currentPassword">{{ $t('message.currentPassword') }}</label>
            <input 
              type="password" 
              id="currentPassword" 
              v-model="passwordForm.currentPassword"
            />
          </div>

          <div class="form-group">
            <label for="newPassword">{{ $t('message.newPassword') }}</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="passwordForm.newPassword"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">{{ $t('message.confirmPassword') }}</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="passwordForm.confirmPassword"
            />
          </div>

          <div class="text-center mt-3">
            <button 
              type="button" 
              class="btn btn-secondary"
              @click="changePassword"
              :disabled="!canChangePassword"
            >
              {{ $t('message.updatePassword') }}
            </button>
          </div>
        </div>

        <div class="flex gap-3 justify-center mt-4">
          <button type="submit" class="btn btn-primary">
            {{ $t('message.saveChanges') }}
          </button>
          <router-link to="/" class="btn btn-secondary">
            {{ $t('message.cancel') }}
          </router-link>
        </div>
      </form>

      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h3 class="text-center mb-3">{{ $t(`message.modal.${modalTitle}`) }}</h3>
          <p class="text-center">{{ $t(`message.modal.${modalMessage}`) }}</p>
          <div class="modal-actions">
            <button class="btn btn-primary" @click="closeModal">{{ $t('message.modal.ok') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, updateUser } from '@/api/user'
import { updateUserPassword } from '@/api/auth'
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

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const canChangePassword = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

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
      modalTitle.value = 'error'
      modalMessage.value = 'avatarUploadFailed'
      showModal.value = true
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
    modalTitle.value = 'error'
    modalMessage.value = 'profileUpdateFailed'
    showModal.value = true
  }
}

const changePassword = async () => {
  if (!canChangePassword.value) return
  
  try {
    const success = await updateUserPassword(passwordForm.value.currentPassword, passwordForm.value.newPassword)
    if (success) {
      modalTitle.value = 'success'
      modalMessage.value = 'passwordUpdateSuccess'
    } else {
      modalTitle.value = 'error'
      modalMessage.value = 'passwordUpdateFailed'
    }
    showModal.value = true
    
    // Clear the form only on success
    if (success) {
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  } catch (error) {
    console.error('Failed to update password:', error)
    modalTitle.value = 'error'
    modalMessage.value = 'passwordUpdateFailed'
    showModal.value = true
  }
}

const closeModal = () => {
  showModal.value = false
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