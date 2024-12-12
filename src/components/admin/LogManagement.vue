<template>
  <div class="mb-5">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
      <h2>System Logs</h2>
      <div class="flex flex-wrap gap-2">
        <button class="btn btn-danger btn-compact" @click="$emit('cleanup')">
          Cleanup Old Logs
        </button>
        <div class="flex flex-wrap gap-2">
          <input 
            type="datetime-local" 
            v-model="dateFilters.startDate"
            class="form-input date-input"
          />
          <input 
            type="datetime-local" 
            v-model="dateFilters.endDate"
            class="form-input date-input"
          />
          <button 
            class="btn btn-primary btn-compact"
            @click="$emit('filterDate', dateFilters)"
          >
            Filter
          </button>
        </div>
        <select 
          v-model="operationType" 
          @change="$emit('filterType', operationType)" 
          class="form-select select-compact"
        >
          <option value="">All Operations</option>
          <option value="USER_LOGIN">Login</option>
          <option value="USER_LOGOUT">Logout</option>
          <option value="USER_REGISTER">Register</option>
          <option value="CREATE_RESERVATION">Reservation Create</option>
          <option value="APPROVE_RESERVATION">Reservation Approve</option>
          <option value="REJECT_RESERVATION">Reservation Reject</option>
          <option value="CREATE_MEETING_ROOM">Meeting Room Create</option>
          <option value="UPDATE_MEETING_ROOM">Meeting Room Update</option>
          <option value="DELETE_MEETING_ROOM">Meeting Room Delete</option>
          <option value="CREATE_USER">User Create</option>
          <option value="UPDATE_USER">User Update</option>
          <option value="DELETE_USER">User Delete</option>
          <option value="FILE_UPLOAD">File Upload</option>
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
      
      try {
        // Decode base64 string
        const decoded = atob(ipAddress)
        
        // If length is 4, it's a binary IPv4
        if (decoded.length === 4) {
          return Array.from(decoded)
            .map(char => char.charCodeAt(0))
            .join('.')
        }
        
        // If length is 16, it's a binary IPv6
        if (decoded.length === 16) {
          return Array.from(decoded)
            .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .reduce((acc, octet, i) => {
              if (i % 2 === 0) {
                acc.push(octet)
              } else {
                acc[acc.length - 1] += octet
              }
              return acc
            }, [] as string[])
            .join(':')
        }
        
        // If neither 4 nor 16 bytes, assume it's an encoded string representation
        return decoded
      } catch (e) {
        return 'Invalid IP'
      }
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