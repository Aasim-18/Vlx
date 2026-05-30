import * as z from 'zod';

export const userSchma = z.object({
  name: z.string().min(5).max(25),
  mobile: z.string().length(11),
  batch: z.string().length(11),
});
