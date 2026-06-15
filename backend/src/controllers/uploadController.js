import path from 'path';
import { unlink } from 'fs/promises';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve('uploads');
const BASE_URL = process.env.BASE_URL || '';

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const url = `${BASE_URL}/uploads/${req.file.filename}`;
    res.status(201).json({ url, filename: req.file.filename });
  } catch (err) { next(err); }
}

export async function deleteFile(req, res, next) {
  try {
    const { filename } = req.body;
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename.' });
    }
    const filePath = path.join(UPLOAD_DIR, filename);
    await unlink(filePath);
    res.status(204).end();
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'File not found.' });
    next(err);
  }
}
