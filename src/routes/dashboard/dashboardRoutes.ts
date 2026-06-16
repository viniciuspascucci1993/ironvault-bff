import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { dashboardService } from '../../services/dashboardService'

export async function dashboardRoutes(fastify: FastifyInstance) {

  fastify.get('/dashboard/summary', { preHandler: [(fastify as any).authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.split(' ')[1] || ''

    try {
      const data = await dashboardService.getSummary(token)
      return reply.send(data)
    } catch (err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })
}