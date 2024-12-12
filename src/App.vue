<template>
  <div class="app">
    <nav v-if="isAuthenticated">
      <router-link to="/">Home</router-link> |
      <router-link to="/rooms">Meeting Rooms</router-link> |
      <router-link to="/bookings">My Bookings</router-link>
      <template v-if="isAdmin">| <router-link to="/admin">Admin</router-link></template>
      <button @click="logout" class="logout-btn">Logout</button>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { checkAuth, checkIsAdmin, logout as authLogout } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const isAuthenticated = ref(false)
const isAdmin = ref(false)

const checkAuthStatus = async () => {
  isAuthenticated.value = await checkAuth()
  if (isAuthenticated.value) {
    isAdmin.value = await checkIsAdmin()
  }
}

onMounted(async () => {
  await checkAuthStatus()
})

// Watch for route changes to recheck auth status
watch(
  () => route.path,
  async () => {
    await checkAuthStatus()
  }
)

const logout = async () => {
  await authLogout()
  isAuthenticated.value = false
  isAdmin.value = false
  router.push('/login')
}
</script>

<style>
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

nav {
  padding: 1rem 0;
  margin-bottom: 2rem;
}

nav a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #2c3e50;
}

nav a.router-link-active {
  color: #42b983;
}

.logout-btn {
  float: right;
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
