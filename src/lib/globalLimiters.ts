import { RateLimiterMemory } from 'rate-limiter-flexible';

export const globalLimiter = new RateLimiterMemory({
  points: 200,
  duration: 60,
});

export const authWriteLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60,
});

export const authReadLimiter = new RateLimiterMemory({
  points: 60,
  duration: 60,
});
