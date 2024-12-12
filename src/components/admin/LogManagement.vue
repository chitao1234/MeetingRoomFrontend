<template>
  <div class="mb-5">
    <div class="flex justify-between items-center mb-4">
      <h2>System Logs</h2>
      <div class="flex gap-2">
        <button class="btn btn-danger" @click="$emit('cleanup')">
          Cleanup Old Logs
        </button>
        <div class="flex gap-2">
          <input 
            type="datetime-local" 
            v-model="dateFilters.startDate"
            class="form-input"
          />
          <input 
            type="datetime-local" 
            v-model="dateFilters.endDate"
            class="form-input"
          />
          <button 
            class="btn btn-primary"
            @click="$emit('filterDate', dateFilters)"
          >
            Filter
          </button>
        </div>
        <select v-model="operationType" @change="$emit('filterType', operationType)" class="form-select">
          <option value="">All Operations</option>
          <option value="USER_LOGIN">Login</option>
          <option value="USER_LOGOUT">Logout</option>
          <option value="USER_REGISTER">Register</option>
          <option value="RESERVATION_CREATE">Reservation Create</option>
          <option value="RESERVATION_UPDATE">Reservation Update</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Operation</th>
            <th>Details</th>
            <th>IP Address</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.logId">
            <td>{{ log.logId }}</td>
            <td>{{ getUserName(log.userId) }}</td>
            <td>{{ log.operationType }}</td>
            <td>{{ log.operationDetails }}</td>
            <td>{{ formatIpAddress(log.ipAddress) }}</td>
            <td>{{ formatDateTime(log.createdTime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { formatDateTime } from '@/utils/dateTime'
import { Log } from '@/api/log'

export default defineComponent({
  name: 'LogManagement',
  props: {
    logs: {
      type: Array as PropType<Log[]>,
      required: true
    },
    getUserName: {
      type: Function as PropType<(userId: number) => string>,
      required: true
    }
  },
  emits: ['cleanup', 'filterDate', 'filterType'],
  setup() {
    const dateFilters = ref({
      startDate: '',
      endDate: ''
    })
    const operationType = ref('')

    const formatIpAddress = (ipAddress: string): string => {
      if (!ipAddress) return '-'
      return ipAddress
    }

    return {
      dateFilters,
      operationType,
      formatDateTime,
      formatIpAddress
    }
  }
})
</script> 