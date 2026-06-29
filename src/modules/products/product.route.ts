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

router.post('/create', requireAuth, upload.single('images'), createProduct);
router.get('/get', getAllProducts);
router.put('/update/:id', requireAuth, upload.single('images'), updateProduct);
router.delete('/delete/:id', requireAuth, deleteProduct);
router.put('/update-status/:id', requireAuth, updateProductStatus);
router.get('/get/:id', requireAuth, getProduct);

export default router;
