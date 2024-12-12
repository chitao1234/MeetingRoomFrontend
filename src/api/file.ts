import api from './auth'

export async function uploadFile(file: File, type: 'room' | 'avatar'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const response = await api.post<{url: string}>('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  console.log(response.data)
  return response.data.url
} 