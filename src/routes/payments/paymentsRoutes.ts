import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { paymentService } from '../../services/paymentsService'

export async function paymentRoutes(fastify: FastifyInstance) {

  fastify.get('/payments', { preHandler: [(fastify as any).authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.split(' ')[1] || ''
    const { page, size, status } = request.query as { page?: number; size?: number; status?: string }
    
    try {
      const data = await paymentService.listTransactions(token, page, size)
      return reply.send(data)
    } catch(err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })

  fastify.get('/payments/:id', { preHandler: [(fastify as any).authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.split(' ')[1] || ''
    const { id } = request.params as { id: string }

    try {
      const data = await paymentService.getPaymentById(token, id)
      return reply.send(data)
    } catch(err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })

  fastify.patch('/payments/:id/status', { preHandler: [(fastify as any).authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.split(' ')[1] || ''
    const { id } = request.params as { id: string }
    const { status, failureReason } = request.body as { status: string; failureReason?: string }
    
    try {
      const data = await paymentService.updateStatus(token, id, status, failureReason)
      return reply.send(data)
    } catch(err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })
}