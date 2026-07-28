import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { merchantService } from '../../services/merchantsService'

export async function merchantsRoutes(fastify: FastifyInstance) {

  fastify.get('/merchants/profile/:userId', { preHandler: [(fastify as any).authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.params as { userId: string }

    try {
      const data = await merchantService.getProfile(userId)
      return reply.send(data)
    } catch (err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })
}