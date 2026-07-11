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

const router = Router();

router.post('/', requireAuth, upload.single('images'), createProduct);
router.get('/', getAllProducts);
router.get('/:id', requireAuth, getProduct);
router.put('/:id', requireAuth, upload.single('images'), updateProduct);
router.patch('/:id/status', requireAuth, updateProductStatus);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
