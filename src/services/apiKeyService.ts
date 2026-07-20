import axios, { AxiosInstance } from "axios";
import dotenv from 'dotenv';

dotenv.config()

const authClient: AxiosInstance = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL || 'http://localhost:8081',
  timeout: 5000
})

export const apiServiceKey = {
  generate: async (token: string) => {
    const response = await authClient.post('/api/keys/generate', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  get: async (token: string) => {
    const response = await authClient.get('/api/keys', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  revoke: async (token: string) => {
    const response = await authClient.delete('/api/keys/revoke', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}