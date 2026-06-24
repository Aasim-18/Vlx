import { AsyncHandler } from '../../utils/AsyncHandler.js';
import { products } from '../../DB/schema/exporter.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { productSchema } from './product.validation.js';
import { db } from '../../DB/index.js';
import { eq } from 'drizzle-orm';
import { getAuth } from '@clerk/express';
import { user, user_profile } from '../../DB/schema/exporter.js';
import { uploadImage } from '../../utils/cloudinary.js';

const createProduct = AsyncHandler(async (req, res) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    console.log('Zod errors:', JSON.stringify(result.error.flatten(), null, 2));
    throw new ApiError(400, 'Invalid product data');
  }

  const product = result.data;

  const { userId } = getAuth(req);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const [existedUser] = await db
    .select({ id: user_profile.user_id, collageName: user_profile.collageName })
    .from(user_profile)
    .where(eq(user_profile.user_id, userId))
    .limit(1);

  if (!existedUser) {
    throw new ApiError(404, 'User not found');
  }

  // first uploading to cloudinary here;

  if (!req.file) {
    throw new ApiError(402, 'No File uploaded');
  }

  const Image = await uploadImage(req.file.buffer);

  if (!Image) {
    throw new ApiError(500, 'Failed to save Image');
  }

  const NewProduct = await db.insert(products).values({
    name: product.name,
    detail: product.details,
    category: product.category,
    price: product.price,
    userId: existedUser.id,
    isAvalable: true,
    status: product.status,
    images: Image.secure_url,
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
    throw new ApiError(401, 'Unauthorized!, user not found');
  }

  const [existedUser] = await db
    .select({ id: user_profile.user_id })
    .from(user_profile)
    .where(eq(user_profile.user_id, userId))
    .limit(1);

  if (!existedUser) {
    throw new ApiError(404, 'User not found');
  }

  const productId = req.params.id;

  if (!productId || typeof productId !== 'string') {
    throw new ApiError(400, 'ID not provided');
  }

  const [existedProduct] = await db
    .select({ id: products.id, userId: products.userId, images: products.images })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!existedProduct) {
    throw new ApiError(404, 'Product not found');
  }

  if (existedProduct.userId !== existedUser.id) {
    throw new ApiError(403, 'You are not authorized to update this product');
  }

  if (!req.file) {
    throw new ApiError(402, 'No File uploaded');
  }

  const Image = await uploadImage(req.file.buffer);

  if (!Image) {
    throw new ApiError(500, 'Failed to save Image');
  }

  const updatedProduct = await db
    .update(products)
    .set({
      name: product.name,
      detail: product.details,
      category: product.category,
      price: product.price,
      status: product.status,
      images: Image.secure_url,
    })
    .where(eq(products.userId, existedUser.id))
    .returning();

  if (!updatedProduct || updatedProduct.length === 0) {
    throw new ApiError(402, 'Error Updating Product');
  }

  res.status(200).json(new ApiResponse(200, updatedProduct[0], 'Product Updated Successfully'));
});

// delete product

const deleteProduct = AsyncHandler(async (req, res) => {
  const productId = req.params.id;

  if (!productId || typeof productId !== 'string') {
    throw new ApiError(401, 'ID not provided');
  }

  const { userId } = getAuth(req);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const [existedUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.clerkId, userId))
    .limit(1);

  if (!existedUser) {
    throw new ApiError(404, 'User not found');
  }

  const [existedProduct] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!existedProduct) {
    throw new ApiError(404, 'Product not found');
  }

  if (existedProduct.userId !== existedUser.id) {
    throw new ApiError(403, 'You are not authorized to delete this product');
  }

  const deletedProduct = await db.delete(products).where(eq(products.id, productId)).returning();

  if (!deletedProduct || deletedProduct.length === 0) {
    throw new ApiError(402, 'Error Deleting Product');
  }

  res.status(200).json(new ApiResponse(200, deletedProduct[0], 'Product Deleted Successfully'));
});

// Get All Products

const getAllProducts = AsyncHandler(async (req, res) => {
  const AllProducts = await db.select().from(products);

  res.status(200).json(new ApiResponse(200, AllProducts, 'Products Retrieved Successfully'));
});

export { createProduct, updateProduct, deleteProduct, getAllProducts };
