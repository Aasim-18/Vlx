import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  if (!env.databaseUrl) {
    return;
  }
};
