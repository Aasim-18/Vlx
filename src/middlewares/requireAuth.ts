import { getAuth } from '@clerk/express';
import { ApiError } from '../utils/ApiError.js';
import type { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  req.userId = userId;
  next();
};

export { requireAuth };
