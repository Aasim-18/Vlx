export const connectDatabase = async (): Promise<void> => {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  if (!databaseUrl) return;

  // Database connection bootstrap point.
  void databaseUrl;
};
