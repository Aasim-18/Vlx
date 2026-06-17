import { Router } from 'express';
import { HandleUser, SetDetails } from './user.controller.js';

const router = Router();

router.post('/register', HandleUser);
router.patch('/complete', SetDetails);

export default router;
