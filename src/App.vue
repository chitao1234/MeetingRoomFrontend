<template>
  <div class="container">
    <!-- Desktop nav -->
    <nav v-if="isAuthenticated" class="desktop-nav">
      <div class="nav-links">
        <router-link class="nav-link" to="/">Home</router-link> |
        <router-link class="nav-link" to="/rooms">Meeting Rooms</router-link> |
        <router-link class="nav-link" to="/bookings">My Bookings</router-link>
        <template v-if="isAdmin">| <router-link class="nav-link" to="/admin">Admin</router-link></template>
      </div>
      <button @click="logout" class="btn btn-danger">Logout</button>
    </nav>

    <!-- Mobile nav -->
    <nav v-if="isAuthenticated" class="mobile-nav">
      <button class="btn btn-primary menu-btn" @click="showMobileMenu = !showMobileMenu">
        ☰
      </button>
      <div class="mobile-menu" :class="{ active: showMobileMenu }">
        <router-link class="nav-link" to="/" @click="showMobileMenu = false">Home</router-link>
        <router-link class="nav-link" to="/rooms" @click="showMobileMenu = false">Meeting Rooms</router-link>
        <router-link class="nav-link" to="/bookings" @click="showMobileMenu = false">My Bookings</router-link>
        <router-link class="nav-link" v-if="isAdmin" to="/admin" @click="showMobileMenu = false">Admin</router-link>
        <button @click="logout" class="btn btn-danger w-100">Logout</button>
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

<style scoped>
/* Desktop Navigation */
.desktop-nav {
  display: none;
  padding: 1rem 0;
  margin-bottom: 2rem;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Mobile Navigation */
.mobile-nav {
  display: block;
  position: relative;
  margin-bottom: 1.5rem;
}

.menu-btn {
  font-size: 1.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  aspect-ratio: 1;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  box-shadow: var(--shadow);
  border-radius: 4px;
  padding: 0.75rem;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu.active {
  opacity: 1;
  visibility: visible;
}

/* Media Queries */
@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
  
  .desktop-nav {
    display: flex;
  }
}
</style>
