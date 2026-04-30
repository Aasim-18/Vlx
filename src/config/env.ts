import { configDotenv } from "dotenv";

configDotenv();

const parsedPort = Number(process.env.PORT ?? 3000);

if (Number.isNaN(parsedPort) || parsedPort <= 0) {
  throw new Error("PORT must be a valid positive number.");
}

export const env = {
  port: parsedPort,
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  databaseUrl: process.env.DATABASE_URL ?? "",
};
