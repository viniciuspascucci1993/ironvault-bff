import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";

import { authRoutes } from "./routes/auth/authRoutes";
import { paymentRoutes } from "./routes/payments/paymentsRoutes";
import { usersRoutes } from './routes/users/usersRoutes'
import { dashboardRoutes } from './routes/dashboard/dashboardRoutes'
import { apiKeyRoutes } from "./routes/apikeys/apiKeyRoutes";

import { authenticatePlugin } from "./plugins/authenticate";

dotenv.config();

const fastfy = Fastify({
  logger: true,
});

fastfy.register(jwt, {
  secret: process.env.JWT_SECRET || "secret",
});

fastfy.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

fastfy.register(cors, {
  origin: ['http://localhost:3000', 'https://backoffice.ironvaultpayments.com.br'],
  credentials: true
})

fastfy.register(authenticatePlugin);


fastfy.register(authRoutes, { prefix: "/api" });
fastfy.register(paymentRoutes, { prefix: "/api" });
fastfy.register(usersRoutes, { prefix: '/api' })
fastfy.register(dashboardRoutes, { prefix: '/api' })
fastfy.register(apiKeyRoutes, { prefix: '/api' })

// Health Check
fastfy.get("/health", async () => {
  return { status: "ok", service: "ironvault-bff" };
});

// Start
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastfy.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 IronVault BFF running on port ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
