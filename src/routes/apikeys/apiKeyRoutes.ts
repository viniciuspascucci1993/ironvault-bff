import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { apiServiceKey } from "../../services/apiKeyService";

export async function apiKeyRoutes(fastify: FastifyInstance) {
  fastify.post('/keys/generate', { preHandler: [(fastify as any).authenticate] }, async (request: FastifyRequest, reply: FastifyReply) =>  {
    const token = request.headers.authorization?.split(' ')[1] || ''
    try {
      const data = await apiServiceKey.generate(token)
      return reply.send(data)
    } catch (err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal Server Error' })
    }
  })

  fastify.get('/keys', { preHandler: [(fastify as any).authenticate] }, async (request: FastifyRequest, reply: FastifyReply) =>  {
    const token = request.headers.authorization?.split(' ')[1] || ''
    try {
      const data = await apiServiceKey.get(token)
      return reply.send(data)
    } catch (err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal Server Error' })
    }
  })

  fastify.delete('/keys/revoke', { preHandler: [(fastify as any).authenticate] }, async (request: FastifyRequest, reply: FastifyReply) =>  {
    const token = request.headers.authorization?.split(' ')[1] || ''
    try {
      await apiServiceKey.revoke(token)
      return reply.send({ message: 'API Key revogada com sucesso' })
    } catch (err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })
}