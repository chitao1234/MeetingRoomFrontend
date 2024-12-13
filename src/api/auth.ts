import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  password: string
  email: string
  phone: string
}

export interface AuthResponse {
  token: string
  userId: number
  role: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post('/auth/login', credentials)
    const authResponse = response.data as AuthResponse
    
    // Store both token and userId
    localStorage.setItem('authToken', authResponse.token)
    localStorage.setItem('userId', authResponse.userId.toString())
    localStorage.setItem('userRole', authResponse.role)
    
    // Set token in axios defaults
    api.defaults.headers.common['Authorization'] = `Bearer ${authResponse.token}`
    
    return authResponse
  } catch (error) {
    throw new Error('Login failed')
  }
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post('/auth/register', credentials)
    const authResponse = response.data as AuthResponse
    
    // Store both token and userId
    localStorage.setItem('authToken', authResponse.token)
    localStorage.setItem('userId', authResponse.userId.toString())
    localStorage.setItem('userRole', authResponse.role)
    
    // Set token in axios defaults
    api.defaults.headers.common['Authorization'] = `Bearer ${authResponse.token}`
    
    return authResponse
  } catch (error) {
    throw new Error('Registration failed')
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await api.post('/auth/validate', { token })
    return response.data
  } catch (error) {
    return false
  }
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token)
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userId')
  delete api.defaults.headers.common['Authorization']
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken')
}

export function getUserId(): number | null {
  const userId = localStorage.getItem('userId')
  return userId ? parseInt(userId) : null
}

export function initializeAuth(): void {
  const token = getAuthToken()
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    removeAuthToken()
  }
}

export async function checkAuth(): Promise<boolean> {
  const token = getAuthToken()
  if (!token) {
    return false
  }
  
  try {
    const isValid = await validateToken(token)
    return isValid
  } catch {
    return false
  }
}

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const response = await api.get('/auth/check-admin')
    return response.data
  } catch (error) {
    return false
  }
}

export async function updateUserPassword(
  oldPassword: string, 
  newPassword: string
): Promise<boolean> {
  try {
    const response = await api.post(`/auth/password`, { oldPassword, newPassword })
    return response.data
  } catch (error) {
    return false
  }
}

// Export the api instance for use in other modules
export default api
