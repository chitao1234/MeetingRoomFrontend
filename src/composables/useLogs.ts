import { ref } from 'vue'
import * as logApi from '@/api/log'
import type { Log } from '@/api/log'

export function useLogs() {
  const logs = ref<Log[]>([])

  const loadLogs = async () => {
    try {
      logs.value = await logApi.getLogs()
    } catch (error) {
      console.error('Failed to load logs:', error)
    }
  }

  const filterByDateRange = async (startDate: string, endDate: string) => {
    try {
      logs.value = await logApi.getLogsByDateRange(startDate, endDate)
      return true
    } catch (error) {
      console.error('Failed to filter logs by date:', error)
      return false
    }
  }

  const filterByType = async (operationType: string) => {
    try {
      if (operationType) {
        logs.value = await logApi.getLogsByOperationType(operationType)
      } else {
        await loadLogs()
      }
      return true
    } catch (error) {
      console.error('Failed to filter logs by type:', error)
      return false
    }
  }

  const cleanupOldLogs = async (daysToKeep: number) => {
    try {
      await logApi.cleanupLogs(daysToKeep)
      await loadLogs()
      return true
    } catch (error) {
      console.error('Failed to cleanup logs:', error)
      return false
    }
  }

  return {
    logs,
    loadLogs,
    filterByDateRange,
    filterByType,
    cleanupOldLogs
  }
} 