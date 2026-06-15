import { Router } from 'express';
import { getStack, adminGetStack, adminCreateStack, adminUpdateStack, adminDeleteStack } from '../controllers/stackController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/admin/all', requireAuth, adminGetStack);
router.post('/admin', requireAuth, adminCreateStack);
router.put('/admin/:id', requireAuth, adminUpdateStack);
router.delete('/admin/:id', requireAuth, adminDeleteStack);
router.get('/', getStack);

export default router;
