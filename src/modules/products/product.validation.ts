import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(2).max(100),
  details: z.string().max(255),
  price: z.number().positive(),
  category: z.string().min(2).max(50),
  isAvailable: z.boolean(),
  status: z.enum(['active', 'inactive']),
  images: z.array(z.string().url()).max(5),
});