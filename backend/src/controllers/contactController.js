import { ContactMessage } from '../models/ContactMessage.js';

export async function sendMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message too long (max 5000 characters).' });
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || null;
    await ContactMessage.create({ name, email, subject, message, ip });

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) { next(err); }
}

export async function adminGetMessages(req, res, next) {
  try {
    const unread = req.query.unread === 'true';
    const messages = await ContactMessage.findAll({ unread });
    res.json(messages);
  } catch (err) { next(err); }
}

export async function adminMarkRead(req, res, next) {
  try {
    await ContactMessage.markRead(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function adminDeleteMessage(req, res, next) {
  try {
    await ContactMessage.delete(parseInt(req.params.id));
    res.status(204).end();
  } catch (err) { next(err); }
}
