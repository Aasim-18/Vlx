import { Router } from 'express';
import { HandleUser, SetDetails } from './user.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

const router = Router();

router.post('/register', HandleUser);
router.patch('/complete', requireAuth, SetDetails);

export default router;
