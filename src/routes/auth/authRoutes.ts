import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authService } from '../../services/authService'

export async function authRoutes(fastify: FastifyInstance) {
  
  fastify.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string }
    const ip = request.headers['x-forwarded-for'] as string || request.ip
    const userAgent = request.headers['user-agent'] || ''

    try {
      const data = await authService.login(email, password, ip, userAgent)
      return reply.send(data)
    } catch(err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })

  fastify.post('/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password, role } = request.body as { email: string; password: string, role: string }

    try {
      const data = await authService.register(email, password, role)
      return reply.status(201).send(data)
    } catch(err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })

  fastify.post('/auth/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = request.body as { refreshToken: string }

    try {
      const data = await authService.refresh(refreshToken)
      return reply.send(data)
    } catch (err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })

  fastify.post('/auth/forgot-password', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email } = request.body as { email: string }

    try {
      await authService.forgotPassword(email)
      return reply.send({ message: 'Email enviado com sucesso' })
    } catch (err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })

  fastify.post('/auth/reset-password', async (request: FastifyRequest, reply: FastifyReply) => {
    const { token, newPassword } = request.body as { token: string; newPassword: string }

    try {
      await authService.resetPassword(token, newPassword)
      return reply.send({ message: 'Senha redefinida com sucesso' })
    } catch (err: any) {
      return reply.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal server error' })
    }
  })
}