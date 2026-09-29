import { Router } from 'express';
import { getStats } from '../controllers/stats.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireRole('ADMIN'), getStats);

export default router;
