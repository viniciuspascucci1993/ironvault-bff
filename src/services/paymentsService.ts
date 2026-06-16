import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const paymentClient: AxiosInstance = axios.create({
    baseURL: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:8080',
    timeout: 5000
})

export const paymentService = {
  listTransactions: async (token: string, page: number = 0, size: number = 10) => {
    const response = await paymentClient.get('/api/payments', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size }
    })
    return response.data
  },

  getPaymentById: async (token: string, id: string) => {
    const response = await paymentClient.get(`/api/payments/${id}`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    return response.data
  },

  updateStatus: async (token: string, id: string, status: string, failureReason?: string) => {
    const response = await paymentClient.patch(`/api/payments/${id}/status`, 
      { status, failureReason },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
}