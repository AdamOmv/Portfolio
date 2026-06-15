import pool from '../database/connection.js';
import { ContactMessage } from '../models/ContactMessage.js';

export async function getStats(req, res, next) {
  try {
    const [[projects]] = await pool.query(`SELECT COUNT(*) as total, SUM(status='published') as published, SUM(status='draft') as draft, SUM(featured=1) as featured FROM projects`);
    const [[stack]] = await pool.query(`SELECT COUNT(*) as total FROM stack_items`);
    const unreadMessages = await ContactMessage.countUnread();

    res.json({
      projects: {
        total: projects.total,
        published: projects.published || 0,
        draft: projects.draft || 0,
        featured: projects.featured || 0,
      },
      stack: { total: stack.total },
      messages: { unread: unreadMessages },
    });
  } catch (err) { next(err); }
}
