import { ApiError } from '../utils/ApiError.js';
import type { Request, Response, NextFunction, Errback } from 'express';

const globalErrorHandler = (err: Errback, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal server error' });
};

export { globalErrorHandler };
