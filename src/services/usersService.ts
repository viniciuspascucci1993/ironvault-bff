import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const usersClient: AxiosInstance = axios.create({
    baseURL: process.env.AUTH_SERVICE_URL || 'http://localhost:8081',
    timeout: 5000
})

export const usersService = {
  listUsers: async (token: string) => {
    const response = await usersClient.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

    getUserById: async (token: string, id: string) => {
    const response = await usersClient.get(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

    updateStatus: async (token: string, id: string, active: boolean) => {
    const response = await usersClient.patch(`/api/users/${id}/status`,
      { active },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

    updateRole: async (token: string, id: string, role: string) => {
    const response = await usersClient.patch(`/api/users/${id}/role`,
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
}