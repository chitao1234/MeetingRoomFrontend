<template>
  <div class="app">
    <nav v-if="isAuthenticated">
      <router-link to="/">Home</router-link> |
      <router-link to="/rooms">Meeting Rooms</router-link> |
      <router-link to="/bookings">My Bookings</router-link>
      <button @click="logout" class="logout-btn">Logout</button>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkAuth, logout as authLogout } from '@/api/auth'

const router = useRouter()
const isAuthenticated = ref(false)

onMounted(async () => {
  isAuthenticated.value = await checkAuth()
})

const logout = async () => {
  await authLogout()
  isAuthenticated.value = false
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
