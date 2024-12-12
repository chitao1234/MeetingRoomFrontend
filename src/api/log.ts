import api from './auth'

export interface Log {
    logId: number
    userId: number
    operationType: string
    operationDetails: string
    ipAddress: string
    createdTime: string
} 

export async function getLogs(userId?: number): Promise<Log[]> {
  const url = userId ? `/logs/user/${userId}` : '/logs'
  const response = await api.get(url)
  return response.data
}

export async function getLogsByDateRange(startDate: string, endDate: string): Promise<Log[]> {
  const response = await api.get(`/logs/date-range`, {
    params: { startDate, endDate }
  })
  return response.data
}

export async function getLogsByOperationType(operationType: string): Promise<Log[]> {
  const response = await api.get(`/logs/operation-type/${operationType}`)
  return response.data
}

export async function cleanupLogs(daysToKeep: number = 30): Promise<void> {
  await api.delete(`/logs/cleanup`, {
    params: { daysToKeep }
  })
} 