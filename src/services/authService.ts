import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const authClient = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL || 'http://localhost:8081',
  timeout: 5000
})

export const authService = {
  login: async (email: string, password: string, ip: string, userAgent: string) => {
    const response = await authClient.post('/api/auth/login', { email, password}, {
      headers: {
        'X-Forwarded-For': ip,
        'User-Agent': userAgent
      }
    })
    return response.data
  },

  register: async (email: string, password: string, role: string) => {
    const response = await authClient.post('/api/auth/register', { email, password, role } )
    return response.data
  },

  refresh: async (refreshToken: string) => {
    const response = await authClient.post('/api/auth/refresh', { refreshToken } )
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await authClient.post('/api/auth/forgot-password', { email } )
    return response.data
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    const response = await authClient.post('/api/auth/reset-password', { token, newPassword } )
    return response.data
  }
}