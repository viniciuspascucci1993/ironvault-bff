import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { usersService } from "../../services/usersService";

export async function usersRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/users",
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.headers.authorization?.split(" ")[1] || "";

      try {
        const data = await usersService.listUsers(token);
        return reply.send(data);
      } catch (err: any) {
        return reply
          .status(err.response?.status || 500)
          .send(err.response?.data || { message: "Internal server error" });
      }
    },
  );

  fastify.get(
    "/users/:id",
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.headers.authorization?.split(" ")[1] || "";
      const { id } = request.params as { id: string };

      try {
        const data = await usersService.getUserById(token, id);
        return reply.send(data);
      } catch (err: any) {
        return reply
          .status(err.response?.status || 500)
          .send(err.response?.data || { message: "Internal server error" });
      }
    },
  );

  fastify.patch(
    "/users/:id/status",
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.headers.authorization?.split(" ")[1] || "";
      const { id } = request.params as { id: string };
      const { active } = request.body as { active: boolean };

      try {
        await usersService.updateStatus(token, id, active);
        return reply.send({ message: "Status atualizado com sucesso" });
      } catch (err: any) {
        return reply
          .status(err.response?.status || 500)
          .send(err.response?.data || { message: "Internal server error" });
      }
    },
  );

  fastify.patch(
    "/users/:id/role",
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.headers.authorization?.split(" ")[1] || "";
      const { id } = request.params as { id: string };
      const { role } = request.body as { role: string };

      try {
        await usersService.updateRole(token, id, role);
        return reply.send({ message: "Role atualizada com sucesso" });
      } catch (err: any) {
        return reply
          .status(err.response?.status || 500)
          .send(err.response?.data || { message: "Internal server error" });
      }
    },
  );

  fastify.get(
    "/users/login-logs",
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.headers.authorization?.split(" ")[1] || "";

      try {
        const data = await usersService.getLoginLogs(token);
        return reply.send(data);
      } catch (err: any) {
        return reply
          .status(err.response?.status || 500)
          .send(err.response?.data || { message: "Internal server error" });
      }
    },
  );

  fastify.patch(
    "/users/:id/approve",
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.headers.authorization?.split(" ")[1] || "";
      const { id } = request.params as { id: string };

      try {
        await usersService.approve(token, id);
        return reply.send({ message: "Usuário aprovado com sucesso" });
      } catch (err: any) {
        return reply
          .status(err.response?.status || 500)
          .send(err.response?.data || { message: "Internal server error" });
      }
    },
  );

  fastify.patch(
    "/users/:id/reject",
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.headers.authorization?.split(" ")[1] || "";
      const { id } = request.params as { id: string };

      try {
        await usersService.reject(token, id);
        return reply.send({ message: "Usuário rejeitado com sucesso" });
      } catch (err: any) {
        return reply
          .status(err.response?.status || 500)
          .send(err.response?.data || { message: "Internal server error" });
      }
    },
  );
}
