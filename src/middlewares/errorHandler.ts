import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  const message =
    err instanceof Error ? err.message : "Something went wrong on the server.";

  res.status(500).json({
    success: false,
    message,
    errors: [],
  });
};
