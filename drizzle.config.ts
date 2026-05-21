import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();


export default defineConfig({

    dialect: "postgresql",
    out: "./src/DB/migrations",
    schema: "./src/DB/schema",
    dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

     
    

})