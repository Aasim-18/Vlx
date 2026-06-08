import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(2).max(55),
  details: z.string().max(255),
  price: z.number().positive(),
  category: z.string().min(2).max(55),
  images: z.array(z.string().url()).max(5),
  isAvalable: z.boolean(),
  status: z.enum(['available', 'unavailable']),
});
