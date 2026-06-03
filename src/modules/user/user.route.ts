import { Router } from 'express';
import { RegisterUser, SetDetails } from './user.controller.js';

const router = Router();

router.post('/register', RegisterUser);
router.patch('/complete', SetDetails);

export default router;
