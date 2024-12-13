<template>
  <div class="notifications">
    <div class="notifications-header">
      <h3>{{ $t('message.notifications.title') }}</h3>
      <button 
        @click="markAllAsRead" 
        v-if="hasUnread" 
        class="btn btn-primary"
      >
        {{ $t('message.notifications.markAllAsRead') }}
      </button>
    </div>
    
    <div class="notification-items">
      <div v-if="sortedNotifications.length === 0" class="text-center p-4">
        {{ $t('message.notifications.noNotifications') }}
      </div>
      <div v-for="notification in sortedNotifications" 
           :key="notification.notificationId"
           :class="['card', { unread: !notification.isRead }]">
        <div class="notification-content">
          <h4>{{ notification.title }}</h4>
          <p>{{ notification.content }}</p>
          <span class="notification-time">{{ formatTime(notification.createdTime) }}</span>
        </div>
        <div class="notification-actions">
          <button v-if="!notification.isRead" 
                  class="btn btn-primary"
                  @click="markAsRead(notification.notificationId)">
            {{ $t('message.notifications.markAsRead') }}
          </button>
          <button 
            class="btn btn-danger"
            @click="deleteNotification(notification.notificationId)">
            {{ $t('message.notifications.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Notification, getUserNotifications, markAsRead as markNotificationAsRead, 
         markAllAsRead as markAllNotificationsAsRead, deleteNotification as removeNotification } 
from '@/api/notification'

const props = defineProps<{
  userId: number
}>()

const notifications = ref<Notification[]>([])

const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => {
    // First sort by read status (unread first)
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1
    }
    // Then sort by date (newest first)
    return new Date(b.createdTime || 0).getTime() - new Date(a.createdTime || 0).getTime()
  })
})

const hasUnread = computed(() => {
  return notifications.value.some(notification => !notification.isRead)
})

async function loadNotifications() {
  try {
    notifications.value = await getUserNotifications(props.userId)
  } catch (error) {
    console.error('Failed to load notifications:', error)
  }
}

async function markAsRead(notificationId: number) {
  try {
    await markNotificationAsRead(notificationId)
    await loadNotifications()
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

async function markAllAsRead() {
  try {
    await markAllNotificationsAsRead(props.userId)
    await loadNotifications()
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

async function deleteNotification(notificationId: number) {
  try {
    await removeNotification(notificationId)
    await loadNotifications()
  } catch (error) {
    console.error('Failed to delete notification:', error)
  }
}

function formatTime(timeString?: string): string {
  if (!timeString) return ''
  return new Date(timeString).toLocaleString()
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.notifications {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card.unread {
  background-color: #f0f7ff;
  border-left: 3px solid #1976d2;
}

.notification-content h4 {
  margin: 0 0 0.5rem 0;
}

.notification-time {
  color: #666;
  font-size: 0.9rem;
}

.notification-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.notifications-header button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
}

.notifications-header button:hover {
  background-color: #1565c0;
}
</style> 