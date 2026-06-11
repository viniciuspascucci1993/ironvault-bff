import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

export async function authenticatePlugin(fastfy: FastifyInstance) {
  (fastfy as any).decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.status(401).send({ message: 'Unauthorized' })
    }
  })

  fastfy.get('/api/protected', { preHandler: [(fastfy as any).authenticate] }, async (request, reply) => {
    return { message: 'Você está autenticado!' }
  })
}