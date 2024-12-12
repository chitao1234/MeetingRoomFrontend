<template>
  <div class="mb-5">
    <div class="flex justify-between items-center mb-4">
      <h2>User Management</h2>
      <button class="btn btn-primary" @click="$emit('showCreateModal')">Create User</button>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.userId">
            <td>{{ user.userId }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <div class="flex gap-2">
                <button @click="$emit('edit', user)" class="btn btn-primary">Edit</button>
                <button @click="$emit('delete', user.userId)" class="btn btn-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { User } from '@/api/user'

export default defineComponent({
  name: 'UserManagement',
  props: {
    users: {
      type: Array as () => User[],
      required: true
    }
  },
  emits: ['showCreateModal', 'edit', 'delete']
})
</script> 