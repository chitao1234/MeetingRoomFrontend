<template>
  <div class="flex justify-center items-center min-h-80vh">
    <form @submit.prevent="handleRegister" class="card">
      <h2 class="mb-4">Register</h2>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="credentials.username"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="credentials.email"
          required
        />
      </div>
      <div class="form-group">
        <label for="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          v-model="credentials.phone"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
      <p v-if="error" class="error mt-3">{{ error }}</p>
      <p class="text-center mt-3">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register, type RegisterCredentials } from '@/api/auth'

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const credentials = reactive<RegisterCredentials>({
  username: '',
  password: '',
  email: '',
  phone: ''
})

const handleRegister = async () => {
  error.value = ''
  isLoading.value = true
  try {
    await register(credentials)
    router.push('/')
  } catch (e) {
    error.value = 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script> 