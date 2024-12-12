import { ref } from 'vue'
import * as adminApi from '@/api/admin'
import type { User } from '@/api/user'

export function useUsers() {
  const users = ref<User[]>([])

  const loadUsers = async () => {
    try {
      users.value = await adminApi.getAllUsers()
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const createUser = async (userData: Partial<User>) => {
    try {
      await adminApi.createUser(userData)
      await loadUsers()
      return true
    } catch (error) {
      console.error('Failed to create user:', error)
      return false
    }
  }

  const updateUser = async (userId: number, userData: Partial<User>) => {
    try {
      await adminApi.updateUser(userId, userData)
      await loadUsers()
      return true
    } catch (error) {
      console.error('Failed to update user:', error)
      return false
    }
  }

  const deleteUser = async (userId: number) => {
    try {
      await adminApi.deleteUser(userId)
      await loadUsers()
      return true
    } catch (error) {
      console.error('Failed to delete user:', error)
      return false
    }
  }

  return {
    users,
    loadUsers,
    createUser,
    updateUser,
    deleteUser
  }
} 