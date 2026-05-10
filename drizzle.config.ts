import { defineConfig } from "drizzle-kit";


export default defineConfig({

    dialect: "postgresql",
    out: "./src/DB/migrations",
    schema: "./src/DB/schema",

})