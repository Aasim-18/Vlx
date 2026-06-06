import { AsyncHandler } from '../../utils/AsyncHandler.js';
import { productTable } from '../../DB/schema/products.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import dotenv from 'dotenv';
import { productSchema } from './product.validation.js';
import { db } from '../../DB/index.js';
import { eq } from 'drizzle-orm';

dotenv.config();
