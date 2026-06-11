import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";

dotenv.config();

const fastfy = Fastify({
  logger: true,
});

// Plugins
fastfy.register(cors, {
  origin: true,
});

fastfy.register(jwt, {
  secret: process.env.JWT_SECRET || "secret",
});

fastfy.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

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
