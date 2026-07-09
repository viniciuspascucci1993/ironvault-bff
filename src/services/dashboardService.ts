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

    // Agrupamento de transações por dia
    const transactionsByDay = payments.content?.reduce((acc: Record<string, number>, p: any) => {
      const data = new Date(p.createdAt).toLocaleDateString('pt-BR')
      acc[data] = (acc[data] || 0) + 1
      return acc
    }, {}) || {}

    const transactionsByChartData = Object.entries(transactionsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        const  [dayA, monthA, yearA] = a.date.split('/').map(Number)
        const [dayB, monthB, yearB] = b.date.split('/').map(Number)
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime()
      })

    // Receita por dia
    const revenueByDay = payments.content
      ?.filter((p: any) => p.status === 'APPROVED')
      ?.reduce((acc: Record<string, number>, p: any) => {
        const data = new Date(p.createdAt).toLocaleDateString('pt-BR')
        acc[data] = (acc[data] || 0) + p.amount
        return acc
      }, {}) || {}
      
    const revenueByChartData = Object.entries(revenueByDay)
      .map(([date, amount]) => ({date, amount}))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number)
        const [dayB, monthB, yearB] = b.date.split('/').map(Number)
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime()
      })  

    return {
      totalTransactions,
      totalUsers,
      totalRevenue,
      transactionsByStatus: {
        approved,
        failed,
        processing
      },
      transactionsByChartData,
      revenueByChartData
    }
  }
}