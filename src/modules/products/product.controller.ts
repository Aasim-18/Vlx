import { AsyncHandler } from '../../utils/AsyncHandler.js';
import { productTable } from '../../DB/schema/products.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { productSchema } from './product.validation.js';
import { db } from '../../DB/index.js';
import { eq } from 'drizzle-orm';
import { getAuth } from '@clerk/express';
import { userTable } from '../../DB/schema/user.js';

const createProduct = AsyncHandler(async (req, res) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, 'Invalid product data');
  }

  const product = result.data;

  const { userId } = getAuth(req);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const [existedUser] = await db
    .select({ id: userTable.id, collageName: userTable.collageName })
    .from(userTable)
    .where(eq(userTable.clerkId, userId)) // ← userId not id
    .limit(1);

  if (!existedUser) {
    throw new ApiError(404, 'User not found');
  }

  const NewProduct = await db.insert(productTable).values({
    name: product.name,
    detail: product.details,
    category: product.category,
    price: product.price,
    userId: existedUser.id,
    isAvalable: true,
    status: 'available',
    images: product.images,
    collageName: existedUser.collageName,
  });

  // debug
  console.log('New Product:', NewProduct);

  if (!NewProduct) {
    throw new ApiError(402, 'Error Saving Prodcut');
  }

  res.status(200).json(new ApiResponse(200, NewProduct, 'Product Crreated Successfully'));
});

export { createProduct };
