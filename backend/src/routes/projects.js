import { Router } from 'express';
import {
  getPublicProjects, getProjectBySlug,
  adminGetProjects, adminCreateProject, adminUpdateProject,
  adminDeleteProject, adminToggleStatus,
} from '../controllers/projectsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/admin/all', requireAuth, adminGetProjects);
router.post('/admin', requireAuth, adminCreateProject);
router.put('/admin/:id', requireAuth, adminUpdateProject);
router.patch('/admin/:id/status', requireAuth, adminToggleStatus);
router.delete('/admin/:id', requireAuth, adminDeleteProject);
router.get('/', getPublicProjects);
router.get('/:slug', getProjectBySlug);

export default router;
