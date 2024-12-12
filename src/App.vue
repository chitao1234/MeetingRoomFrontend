<template>
  <div class="app">
    <!-- Desktop nav -->
    <nav v-if="isAuthenticated" class="desktop-nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/rooms">Meeting Rooms</router-link> |
      <router-link to="/bookings">My Bookings</router-link>
      <template v-if="isAdmin">| <router-link to="/admin">Admin</router-link></template>
      <button @click="logout" class="logout-btn">Logout</button>
    </nav>

    <!-- Mobile nav -->
    <nav v-if="isAuthenticated" class="mobile-nav">
      <button class="menu-btn" @click="showMobileMenu = !showMobileMenu">
        ☰
      </button>
      <div class="mobile-menu" :class="{ active: showMobileMenu }">
        <router-link to="/" @click="showMobileMenu = false">Home</router-link>
        <router-link to="/rooms" @click="showMobileMenu = false">Meeting Rooms</router-link>
        <router-link to="/bookings" @click="showMobileMenu = false">My Bookings</router-link>
        <router-link v-if="isAdmin" to="/admin" @click="showMobileMenu = false">Admin</router-link>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
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
const showMobileMenu = ref(false)

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
  padding: 1rem;
}

/* Desktop Navigation */
.desktop-nav {
  display: none;
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.desktop-nav a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #2c3e50;
  transition: color 0.3s;
}

.desktop-nav a:hover {
  color: #42b983;
}

.desktop-nav a.router-link-active {
  color: #42b983;
}

/* Mobile Navigation */
.mobile-nav {
  display: block;
  position: relative;
  margin-bottom: 1rem;
}

.menu-btn {
  background: #42b983;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.menu-btn:hover {
  background: #3aa876;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 0.5rem;
  z-index: 1000;
}

.mobile-menu.active {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu a {
  padding: 0.5rem;
  text-decoration: none;
  color: #2c3e50;
}

.mobile-menu .logout-btn {
  width: 100%;
  margin-top: 0.5rem;
}

/* Media Queries */
@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
  
  .desktop-nav {
    display: block;
  }
  
  .app {
    padding: 2rem;
  }
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
