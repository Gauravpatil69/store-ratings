import { Router } from 'express';
import { listStores, createStore, getMyStore, rateStore } from '../controllers/stores.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createStoreSchema } from '../schemas/store.js';
import { ratingSchema } from '../schemas/rating.js';

const router = Router();

router.get('/', authenticate, requireRole('ADMIN', 'USER'), listStores);
router.post('/', authenticate, requireRole('ADMIN'), validate(createStoreSchema), createStore);
router.get('/mine', authenticate, requireRole('OWNER'), getMyStore);
router.put('/:id/rating', authenticate, requireRole('USER'), validate(ratingSchema), rateStore);

export default router;
