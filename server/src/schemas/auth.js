import { z } from 'zod';

const passwordRule = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character');

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signupSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: passwordRule,
});

export const passwordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordRule,
});
