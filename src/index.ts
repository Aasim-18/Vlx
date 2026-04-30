import { app } from "./app.js";
import { initializeDatabase } from "./DB/index.js";
import { env } from "./config/env.js";

const startServer = async (): Promise<void> => {
  await initializeDatabase();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

void startServer().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown startup error.";
  console.error(`Failed to start server: ${message}`);
  process.exit(1);
});
