import { Router } from 'express';
import { uploadFile, deleteFile } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = Router();

router.post('/', requireAuth, uploadMiddleware.single('file'), uploadFile);
router.delete('/', requireAuth, deleteFile);

export default router;
