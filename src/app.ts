import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { apiRouter } from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Vlx backend is running.",
    environment: env.nodeEnv,
  });
});

app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);

export { app };
