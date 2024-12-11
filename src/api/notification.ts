import api from './auth'

export interface Notification {
  notificationId: number
  userId: number
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export async function getNotification(notificationId: number): Promise<Notification> {
  const response = await api.get(`/notifications/${notificationId}`)
  return response.data
}

export async function getUserNotifications(userId: number): Promise<Notification[]> {
  const response = await api.get(`/notifications/user/${userId}`)
  return response.data
}

export async function getUnreadNotifications(userId: number): Promise<Notification[]> {
  const response = await api.get(`/notifications/user/${userId}/unread`)
  return response.data
}

export async function createNotification(notification: Omit<Notification, 'notificationId'>): Promise<Notification> {
  const response = await api.post('/notifications', notification)
  return response.data
}

export async function markAsRead(notificationId: number): Promise<void> {
  await api.put(`/notifications/${notificationId}/read`)
}

export async function markAllAsRead(userId: number): Promise<void> {
  await api.put(`/notifications/user/${userId}/read-all`)
}

export async function deleteNotification(notificationId: number): Promise<void> {
  await api.delete(`/notifications/${notificationId}`)
} 