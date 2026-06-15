import { Router } from 'express';
import authRoutes from './auth.js';
import projectRoutes from './projects.js';
import stackRoutes from './stack.js';
import settingsRoutes from './settings.js';
import contactRoutes from './contact.js';
import uploadRoutes from './upload.js';
import statsRoutes from './stats.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/stack', stackRoutes);
router.use('/settings', settingsRoutes);
router.use('/contact', contactRoutes);
router.use('/upload', uploadRoutes);
router.use('/stats', statsRoutes);

router.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

export default router;
