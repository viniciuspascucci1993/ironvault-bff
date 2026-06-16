import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'

async function authenticate(fastfy: FastifyInstance) {
  (fastfy as any).decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.status(401).send({ message: 'Unauthorized' })
    }
  })
}

export const authenticatePlugin = fp(authenticate)