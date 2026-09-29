import { z } from 'zod';

export const ratingSchema = z.object({
  value: z.number().int().min(1).max(5),
});
