import { Router } from 'express';
import { listUsers, createUser, getUser } from '../controllers/users.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema } from '../schemas/user.js';

const router = Router();

router.get('/', authenticate, requireRole('ADMIN'), listUsers);
router.post('/', authenticate, requireRole('ADMIN'), validate(createUserSchema), createUser);
router.get('/:id', authenticate, requireRole('ADMIN'), getUser);

export default router;
