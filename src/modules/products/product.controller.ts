import { AsyncHandler } from '../../utils/AsyncHandler.js';
import { productTable } from '../../DB/schema/products.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { productSchema } from './product.validation.js';
import { db } from '../../DB/index.js';
import { eq } from 'drizzle-orm';
import { getAuth } from '@clerk/express';
import { userTable } from '../../DB/schema/user.js';
import { uploadImage } from '../../utils/cloudinary.js';

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
    .where(eq(userTable.clerkId, userId))
    .limit(1);

  if (!existedUser) {
    throw new ApiError(404, 'User not found');
  }

  // first uploading to cloudinary here

  const LocalFilePath = req.file?.path;

  const ImageUrl = await uploadImage(LocalFilePath as string);

  const NewProduct = await db.insert(productTable).values({
    name: product.name,
    detail: product.details,
    category: product.category,
    price: product.price,
    userId: existedUser.id,
    isAvalable: true,
    status: product.status,
    images: ImageUrl.url,
    collageName: existedUser.collageName,
  });

  if (!NewProduct) {
    throw new ApiError(402, 'Error Saving Prodcut');
  }

  res.status(200).json(new ApiResponse(200, NewProduct, 'Product Crreated Successfully'));
});

 // update product

const updateProduct = AsyncHandler(async (req, res) => {
  
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
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.clerkId, userId))
    .limit(1);

  if (!existedUser) {
    throw new ApiError(404, 'User not found');
  }

  const [existedProduct] = await db
    .select({id: productTable.id, userId: productTable.userId, images: productTable.images} )
    .from(productTable)
    .where(eq(productTable.userId, existedUser.id))
    .limit(1);

  if (!existedProduct) {
    throw new ApiError(404, 'Product not found');
  }

  if (existedProduct.userId !== existedUser.id) {
    throw new ApiError(403, 'You are not authorized to update this product');
  }

  let ImageUrl = { url: existedProduct.images };

  if (req.file) {
    const LocalFilePath = req.file?.path;
    ImageUrl = await uploadImage(LocalFilePath);
  }

  const updatedProduct = await db
    .update(productTable)
    .set({
      name: product.name,
      detail: product.details,
      category: product.category,
      price: product.price,
      status: product.status,
      images: ImageUrl.url,
    })
    .where(eq(productTable.userId, existedUser.id))
    .returning();

  if (!updatedProduct || updatedProduct.length === 0) {
    throw new ApiError(402, 'Error Updating Product');
  }

  res.status(200).json(new ApiResponse(200, updatedProduct[0], 'Product Updated Successfully'));
});


// delete product

const deleteProduct = AsyncHandler(async (req, res) => {
  
  const { userId } = getAuth(req);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const [existedUser] = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.clerkId, userId))
    .limit(1);

  if (!existedUser) {
    throw new ApiError(404, 'User not found');
  }

  const [existedProduct] = await db
    .select()
    .from(productTable)
    .where(eq(productTable.userId, existedUser.id))
    .limit(1);

  if (!existedProduct) {
    throw new ApiError(404, 'Product not found');
  }

  if (existedProduct.userId !== existedUser.id) {
    throw new ApiError(403, 'You are not authorized to delete this product');
  }

  const deletedProduct = await db
    .delete(productTable)
    .where(eq(productTable.userId, existedUser.id))
    .returning();

  if (!deletedProduct || deletedProduct.length === 0) {
    throw new ApiError(402, 'Error Deleting Product');
  }

  res.status(200).json(new ApiResponse(200, deletedProduct[0], 'Product Deleted Successfully'));
});


// Get All Products

const getAllProducts = AsyncHandler(async (req, res) => {
  const products = await db.select().from(productTable);
  res.status(200).json(new ApiResponse(200, products, 'Products Retrieved Successfully'));
});




export { createProduct, updateProduct, deleteProduct, getAllProducts };
