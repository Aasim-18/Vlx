import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(2).max(55),
  details: z.string().max(255),
  price: z.coerce.number().positive(),
  category: z.string().min(2).max(55),
  status: z.enum(['available', 'unavailable']),
  images: z.array(z.string()).optional(),
});
