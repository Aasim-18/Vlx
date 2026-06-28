import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from './product.controller.js';
import { upload } from '../../middlewares/multer.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

const router = Router();

router.post('/create', requireAuth, upload.single('images'), createProduct);
router.get('/get', getAllProducts);
router.put('/update/:id', requireAuth, upload.single('images'), updateProduct);
router.delete('/delete/:id', requireAuth, deleteProduct);

export default router;
