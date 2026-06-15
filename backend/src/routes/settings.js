import { Router } from 'express';
import { getPublicSettings, adminGetSettings, adminUpdateSettings } from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getPublicSettings);
router.get('/admin/all', requireAuth, adminGetSettings);
router.put('/admin', requireAuth, adminUpdateSettings);

export default router;
