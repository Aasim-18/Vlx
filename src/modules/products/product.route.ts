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
router.put('/update/:id', upload.single('images'), updateProduct);
router.delete('/delete/:id', deleteProduct);

export default router;
