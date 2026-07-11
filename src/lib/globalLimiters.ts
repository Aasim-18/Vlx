import { RateLimiterMemory } from 'rate-limiter-flexible';

export const globalRateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});
