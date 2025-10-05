import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const createRateLimiter = (options = {}) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,                
    keyGenerator: (req) => ipKeyGenerator(req),
    ...options,
  });
