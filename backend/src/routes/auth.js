import { Router } from 'express';
import { login, getMe, changePassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.get('/me', requireAuth, getMe);
router.put('/password', requireAuth, changePassword);

export default router;
