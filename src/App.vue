<template>
  <div class="container">
    <!-- Desktop nav -->
    <nav v-if="isAuthenticated" class="desktop-nav">
      <div class="nav-links">
        <router-link class="nav-link" to="/">{{ $t('message.nav.home') }}</router-link> |
        <router-link class="nav-link" to="/rooms">{{ $t('message.nav.meetingRooms') }}</router-link> |
        <router-link class="nav-link" to="/bookings">{{ $t('message.nav.myBookings') }}</router-link>
        <template v-if="isAdmin">| <router-link class="nav-link" to="/admin">{{ $t('message.nav.admin') }}</router-link></template>
      </div>
      <div class="nav-right">
        <LanguageSwitcher />
        <router-link to="/profile" class="avatar-link">
          <img 
            :src="userInfo.avatarUrl || xidian" 
            :alt="userInfo.username"
            class="avatar-img"
          />
        </router-link>
        <button @click="logout" class="btn btn-danger">{{ $t('message.nav.logout') }}</button>
      </div>
    </nav>

    <!-- Mobile nav -->
    <nav v-if="isAuthenticated" class="mobile-nav">
      <div class="mobile-header">
        <button class="btn btn-primary menu-btn" @click="showMobileMenu = !showMobileMenu">
          ☰
        </button>
        <div class="mobile-right">
          <LanguageSwitcher />
          <router-link to="/profile" class="avatar-link">
            <img 
              :src="userInfo.avatarUrl || xidian" 
              :alt="userInfo.username"
              class="avatar-img"
            />
          </router-link>
        </div>
      </div>
      <div class="mobile-menu" :class="{ active: showMobileMenu }">
        <router-link class="nav-link" to="/" @click="showMobileMenu = false">
          {{ $t('message.nav.home') }}
        </router-link>
        <router-link class="nav-link" to="/rooms" @click="showMobileMenu = false">
          {{ $t('message.nav.meetingRooms') }}
        </router-link>
        <router-link class="nav-link" to="/bookings" @click="showMobileMenu = false">
          {{ $t('message.nav.myBookings') }}
        </router-link>
        <router-link class="nav-link" v-if="isAdmin" to="/admin" @click="showMobileMenu = false">
          {{ $t('message.nav.admin') }}
        </router-link>
        <button @click="logout" class="btn btn-danger w-100">
          {{ $t('message.nav.logout') }}
        </button>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { checkAuth, checkIsAdmin, logout as authLogout } from '@/api/auth'
import { getUser } from '@/api/user'
import type { User } from '@/api/user'
import xidian from '@/assets/xidian.png'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const router = useRouter()
const route = useRoute()
const isAuthenticated = ref(false)
const isAdmin = ref(false)
const showMobileMenu = ref(false)
const userInfo = ref<Partial<User>>({
  username: '',
  avatarUrl: ''
})

const checkAuthStatus = async () => {
  isAuthenticated.value = await checkAuth()
  if (isAuthenticated.value) {
    isAdmin.value = await checkIsAdmin()
    // Fetch user info
    try {
      const userId = parseInt(localStorage.getItem('userId') || '0')
      const userData = await getUser(userId)
      userInfo.value = userData
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
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

// Set initial locale from localStorage or browser preference
onMounted(() => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    locale.value = savedLocale
  } else {
    // Use browser language preference if available
    const browserLang = navigator.language.toLowerCase()
    locale.value = browserLang.startsWith('zh') ? 'zh' : 'en'
  }
})
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

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-link {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.2s;
}

.avatar-link:hover {
  transform: scale(1.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Mobile specific styles */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* Update mobile menu styles */
.mobile-menu {
  top: calc(100% + 0.5rem);
}

.mobile-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
