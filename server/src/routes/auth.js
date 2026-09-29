import { Router } from 'express';
import { signup, login, getMe, changePassword } from '../controllers/auth.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema, passwordSchema } from '../schemas/auth.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.patch('/password', authenticate, validate(passwordSchema), changePassword);

export default router;
