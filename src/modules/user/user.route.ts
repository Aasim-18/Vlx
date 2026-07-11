import { Router } from 'express';
import { handleUser, createProfile } from './user.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { rateLimit } from '../../middlewares/rateLimiter.js';
import { authWriteLimiter } from '../../lib/globalLimiters.js';

const router = Router();

router.post('/register', handleUser);
router.post('/complete', requireAuth, rateLimit(authWriteLimiter), createProfile);

export default router;
