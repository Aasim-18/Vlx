import type { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory, type RateLimiterRes } from 'rate-limiter-flexible';

type KeyFn = (req: Request) => string;

const defaultKeyFn: KeyFn = (req) => {
  return req.userId || req.ip || 'unknown';
};

export const rateLimit =
  (limiter: RateLimiterMemory, keyFn: KeyFn = defaultKeyFn) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const key = keyFn(req);

    try {
      await limiter.consume(key);
      next();
    } catch (rejRes) {
      const retryAfter = Math.ceil((rejRes as RateLimiterRes).msBeforeNext / 1000);
      res.set('Retry-After', String(retryAfter));
      res.status(429).json({
        success: false,
        error: 'Too many requests, try again shortly',
      });
    }
  };
