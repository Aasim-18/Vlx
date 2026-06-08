import { Router } from 'express';
import { createProduct } from './product.controller.js';
import { upload } from '../../middlewares/multer.js';

const router = Router();

router.post('/create', upload.single("images") ,createProduct);

export default router;
