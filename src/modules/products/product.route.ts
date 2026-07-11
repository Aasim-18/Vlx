import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  updateProductStatus,
  getProduct,
} from './product.controller.js';
import { upload } from '../../middlewares/multer.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { rateLimit } from '../../middlewares/rateLimiter.js';
import { authWriteLimiter } from '../../lib/globalLimiters.js';

const router = Router();

router.post('/', requireAuth, rateLimit(authWriteLimiter), upload.single('images'), createProduct);
router.get('/', getAllProducts);
router.get('/:id', requireAuth, getProduct);
router.put(
  '/:id',
  requireAuth,
  rateLimit(authWriteLimiter),
  upload.single('images'),
  updateProduct,
);
router.patch('/:id/status', requireAuth, rateLimit(authWriteLimiter), updateProductStatus);
router.delete('/:id', requireAuth, rateLimit(authWriteLimiter), deleteProduct);

export default router;
