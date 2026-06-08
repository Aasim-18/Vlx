import { Router } from 'express';
import { createProduct } from './product.controller.js';

const router = Router();

router.post('/create', createProduct);

export default router;
