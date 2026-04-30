import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json(
    new ApiResponse(200, "Service is healthy", {
      status: "UP",
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    })
  );
};
