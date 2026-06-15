import { SiteSetting } from '../models/SiteSetting.js';

export async function getPublicSettings(req, res, next) {
  try {
    const settings = await SiteSetting.findPublic();
    res.json(settings);
  } catch (err) { next(err); }
}

export async function adminGetSettings(req, res, next) {
  try {
    const settings = await SiteSetting.findAll();
    res.json(settings);
  } catch (err) { next(err); }
}

export async function adminUpdateSettings(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Body must be a key-value object.' });
    }
    const settings = await SiteSetting.batchUpdate(req.body);
    res.json(settings);
  } catch (err) { next(err); }
}
