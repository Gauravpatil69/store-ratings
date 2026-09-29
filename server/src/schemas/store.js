import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  ownerId: z.number().int().optional(),
});
