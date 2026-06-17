import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from './product.controller.js';
import { upload } from '../../middlewares/multer.js';

const router = Router();

router.post('/create', upload.single('images'), createProduct);
router.get('/get', getAllProducts);
router.patch('/update', updateProduct);
router.post('/delete', deleteProduct);

export default router;
