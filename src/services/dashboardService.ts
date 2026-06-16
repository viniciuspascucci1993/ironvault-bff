import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const paymentsClient: AxiosInstance = axios.create({
  baseURL: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:8080',
  timeout: 5000
})

const authClient: AxiosInstance = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL || 'http://localhost:8081',
  timeout: 5000
})

export const dashboardService = {
  getSummary: async (token: string) => {
    const [paymentsResponse, usersResponse] = await Promise.all([
      paymentsClient.get('/api/payments', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 100 }
      }),
      authClient.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])

    const payments = paymentsResponse.data
    const users = usersResponse.data

    const totalTransactions = payments.totalElements || 0
    const totalUsers = users.length || 0

    const approved = payments.content?.filter((p: any) => p.status === 'APPROVED').length || 0
    const failed = payments.content?.filter((p: any) => p.status === 'FAILED').length || 0
    const processing = payments.content?.filter((p: any) => p.status === 'PROCESSING').length || 0

    const totalRevenue = payments.content
      ?.filter((p: any) => p.status === 'APPROVED')
      ?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0

    return {
      totalTransactions,
      totalUsers,
      totalRevenue,
      transactionsByStatus: {
        approved,
        failed,
        processing
      }
    }
  }
}