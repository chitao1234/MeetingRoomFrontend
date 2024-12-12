<template>
  <div class="flex justify-center items-center min-h-80vh">
    <form @submit.prevent="handleLogin" class="card">
      <h2 class="mb-4">{{ $t('message.login') }}</h2>
      <div class="form-group">
        <label for="username">{{ $t('message.username') }}</label>
        <input
          type="text"
          id="username"
          v-model="credentials.username"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">{{ $t('message.password') }}</label>
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        {{ isLoading ? $t('message.loggingIn') : $t('message.login') }}
      </button>
      <p v-if="error" class="error mt-3">{{ $t('message.invalidCredentials') }}</p>
      <p class="text-center mt-3">
        {{ $t('message.noAccount') }}
        <router-link to="/register">{{ $t('message.registerHere') }}</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login, type LoginCredentials, setAuthToken } from '@/api/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
    error.value = t('message.invalidCredentials')
  } finally {
    isLoading.value = false
  }
}
</script> 