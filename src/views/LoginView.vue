<template>
  <div class="flex justify-center items-center min-h-80vh">
    <form @submit.prevent="handleLogin" class="card">
      <h2 class="mb-4">Login</h2>
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
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="error mt-3">{{ error }}</p>
      <p class="text-center mt-3">
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login, type LoginCredentials, setAuthToken } from '@/api/auth'

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const credentials = reactive<LoginCredentials>({
  username: '',
  password: ''
})

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  try {
    const response = await login(credentials)
    setAuthToken(response.token)
    router.push('/')
  } catch (e) {
    error.value = 'Invalid username or password'
  } finally {
    isLoading.value = false
  }
}
</script> 