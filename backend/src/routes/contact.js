import { Router } from 'express';
import { sendMessage, adminGetMessages, adminMarkRead, adminDeleteMessage } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', contactLimiter, sendMessage);
router.get('/admin', requireAuth, adminGetMessages);
router.patch('/admin/:id/read', requireAuth, adminMarkRead);
router.delete('/admin/:id', requireAuth, adminDeleteMessage);

export default router;
