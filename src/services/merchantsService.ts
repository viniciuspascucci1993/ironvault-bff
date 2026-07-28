import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

const merchantsClient = axios.create({
  baseURL: process.env.MERCHANTS_SERVICE_URL || 'http://localhost:8083',
  timeout: 5000
})

export const merchantService = {
    createProfile: async (userId: string, businessName: string, phone?: string, segment?: string) => {
    const response = await merchantsClient.post('/api/merchants/profile', 
      { businessName, phone, segment},
      { headers: { 'X-User-Id': userId } }
    )
    return response.data
  },

    getProfile: async (userId: string) => {
    const response = await merchantsClient.get('/api/merchants/profile', {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  }
}