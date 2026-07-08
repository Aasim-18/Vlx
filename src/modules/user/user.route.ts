import { Router } from 'express';
import { handleUser, createProfile } from './user.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

const router = Router();

router.post('/register', handleUser);
router.post('/complete', requireAuth, createProfile);

export default router;
