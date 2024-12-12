<template>
  <div class="mb-5">
    <div class="flex justify-between items-center mb-4">
      <h2>{{ $t('message.management.userList') }}</h2>
      <button class="btn btn-primary" @click="$emit('showCreateModal')">
        {{ $t('message.management.createNew') }}
      </button>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('message.username') }}</th>
            <th>{{ $t('message.email') }}</th>
            <th>{{ $t('message.forms.role') }}</th>
            <th>{{ $t('message.management.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.userId">
            <td>{{ user.userId }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ $t(`message.forms.role${user.role === 'USER' ? 'User' : 'Admin'}`) }}</td>
            <td>
              <div class="flex gap-2">
                <button @click="$emit('edit', user)" class="btn btn-primary">
                  {{ $t('message.edit') }}
                </button>
                <button @click="$emit('delete', user.userId)" class="btn btn-danger">
                  {{ $t('message.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { User } from '@/api/user'

defineProps<{
  users: User[]
}>()
</script> 