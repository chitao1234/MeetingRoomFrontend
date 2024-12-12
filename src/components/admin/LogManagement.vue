<template>
  <div class="mb-5">
    <div class="flex flex-col gap-4 mb-4">
      <div class="flex justify-between items-center">
        <h2>{{ $t('message.management.logList') }}</h2>
        <button class="btn btn-danger btn-compact" @click="$emit('cleanup')">
          {{ $t('message.management.cleanup') }}
        </button>
      </div>

      <div class="log-filters">
        <!-- Date Range -->
        <div class="date-range">
          <label class="filter-label">{{ $t('message.management.filterByDate') }}:</label>
          <div class="flex gap-2">
            <input 
              type="datetime-local" 
              v-model="dateFilters.startDate"
              class="form-input date-input"
              :placeholder="$t('message.management.from')"
            />
            <input 
              type="datetime-local" 
              v-model="dateFilters.endDate"
              class="form-input date-input"
              :placeholder="$t('message.management.to')"
            />
          </div>
        </div>

        <!-- Operation Type -->
        <div class="operation-filter">
          <label class="filter-label">{{ $t('message.management.filterByType') }}:</label>
          <select 
            v-model="operationType" 
            @change="$emit('filterType', operationType)" 
            class="form-select select-compact"
          >
            <option value="">{{ $t('message.status.all') }}</option>
            <option value="USER_LOGIN">{{ $t('message.login') }}</option>
            <option value="USER_LOGOUT">{{ $t('message.nav.logout') }}</option>
            <option value="USER_REGISTER">{{ $t('message.register') }}</option>
            <option value="CREATE_RESERVATION">{{ $t('message.reservation') }} {{ $t('message.management.createNew') }}</option>
            <option value="APPROVE_RESERVATION">{{ $t('message.reservation') }} {{ $t('message.management.approve') }}</option>
            <option value="REJECT_RESERVATION">{{ $t('message.reservation') }} {{ $t('message.management.reject') }}</option>
            <option value="CREATE_MEETING_ROOM">{{ $t('message.meetingRoom') }} {{ $t('message.management.createNew') }}</option>
            <option value="UPDATE_MEETING_ROOM">{{ $t('message.meetingRoom') }} {{ $t('message.edit') }}</option>
            <option value="DELETE_MEETING_ROOM">{{ $t('message.meetingRoom') }} {{ $t('message.delete') }}</option>
            <option value="CREATE_USER">{{ $t('message.users') }} {{ $t('message.management.createNew') }}</option>
            <option value="UPDATE_USER">{{ $t('message.users') }} {{ $t('message.edit') }}</option>
            <option value="DELETE_USER">{{ $t('message.users') }} {{ $t('message.delete') }}</option>
            <option value="FILE_UPLOAD">{{ $t('message.forms.uploadPhoto') }}</option>
          </select>
        </div>

        <!-- Filter Button -->
        <button 
          class="btn btn-primary btn-compact"
          @click="$emit('filterDate', dateFilters)"
        >
          {{ $t('message.management.apply') }}
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('message.users') }}</th>
            <th>{{ $t('message.management.filterByType') }}</th>
            <th>{{ $t('message.forms.description') }}</th>
            <th>IP</th>
            <th>{{ $t('message.bookingDetails.time') }}</th>
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

<script setup lang="ts">
import { ref, PropType } from 'vue'
import { formatDateTime } from '@/utils/dateTime'
import { Log } from '@/api/log'

defineProps({
  logs: {
    type: Array as PropType<Log[]>,
    required: true
  },
  getUserName: {
    type: Function as PropType<(userId: number) => string>,
    required: true
  }
})

const emits = defineEmits(['cleanup', 'filterDate', 'filterType'])

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
</script> 