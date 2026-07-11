import type { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

export const rateLimit =
  (limiter: RateLimiterMemory, keyFn?: (req: Request) => string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const key = keyFn ? keyFn(req) : req.ip;
    try {
      await limiter.consume(key);
      next();
    } catch (rejRes: any) {
      res.set('Retry-After', String(Math.ceil(rejRes.msBeforeNext / 1000)));
      res.status(429).json({ error: 'Too many requests, try again shortly' });
    }
  };
