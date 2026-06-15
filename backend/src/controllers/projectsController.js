import { Project } from '../models/Project.js';

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// PUBLIC
export async function getPublicProjects(req, res, next) {
  try {
    const projects = req.query.featured === '1'
      ? await Project.findFeatured()
      : await Project.findAllPublished();
    res.json(projects);
  } catch (err) { next(err); }
}

export async function getProjectBySlug(req, res, next) {
  try {
    const project = await Project.findBySlug(req.params.slug);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (err) { next(err); }
}

// ADMIN
export async function adminGetProjects(req, res, next) {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) { next(err); }
}

export async function adminCreateProject(req, res, next) {
  try {
    const data = req.body;
    if (!data.title) return res.status(400).json({ error: 'Title is required.' });
    if (!data.slug) data.slug = slugify(data.title);
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (err) { next(err); }
}

export async function adminUpdateProject(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const existing = await Project.findById(id);
    if (!existing) return res.status(404).json({ error: 'Project not found.' });
    const updated = await Project.update(id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function adminDeleteProject(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const existing = await Project.findById(id);
    if (!existing) return res.status(404).json({ error: 'Project not found.' });
    await Project.delete(id);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function adminToggleStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ error: 'Status must be draft or published.' });
    }
    const updated = await Project.update(id, { status });
    res.json(updated);
  } catch (err) { next(err); }
}
