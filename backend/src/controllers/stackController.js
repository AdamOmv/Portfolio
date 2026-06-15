import { StackItem } from '../models/StackItem.js';

export async function getStack(req, res, next) {
  try {
    const items = await StackItem.findAll({ publicOnly: true });
    res.json(items);
  } catch (err) { next(err); }
}

export async function adminCreateStack(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });
    const item = await StackItem.create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function adminGetStack(req, res, next) {
  try {
    const items = await StackItem.findAll();
    res.json(items);
  } catch (err) { next(err); }
}

export async function adminUpdateStack(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const existing = await StackItem.findById(id);
    if (!existing) return res.status(404).json({ error: 'Stack item not found.' });
    const updated = await StackItem.update(id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function adminDeleteStack(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const existing = await StackItem.findById(id);
    if (!existing) return res.status(404).json({ error: 'Stack item not found.' });
    await StackItem.delete(id);
    res.status(204).end();
  } catch (err) { next(err); }
}
