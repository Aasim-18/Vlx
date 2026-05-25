import {Router} from 'express';
import { RegisterUser, SetDetails } from './user.controller.js';


const router = Router();

router.post('/register', RegisterUser);
router.post("/complete", SetDetails)

export default router;