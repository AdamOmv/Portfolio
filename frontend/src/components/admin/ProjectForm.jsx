import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';

const initialState = {
  title: '',
  slug: '',
  subtitle: '',
  description: '',
  long_description: '',
  cover_url: '',
  tech_tags: '',
  live_url: '',
  github_url: '',
  status: 'draft',
  featured: false,
  sort_order: 0,
  year: '',
};

export default function ProjectForm({ token, project, onSaved, onCancel }) {
  const [form, setForm] = useState(() => mapProjectToForm(project));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = useMemo(() => Boolean(project?.id), [project]);

  useEffect(() => {
    setForm(mapProjectToForm(project));
  }, [project]);

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const payload = new FormData();
      payload.append('file', file);
      const response = await api.post('/upload', payload, token);
      setForm((current) => ({ ...current, cover_url: response.url }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...initialState,
      ...form,
      year: form.year ? Number(form.year) : null,
      sort_order: Number(form.sort_order) || 0,
      tech_tags: form.tech_tags.split(',').map((item) => item.trim()).filter(Boolean),
      featured: Boolean(form.featured),
    };

    try {
      const response = isEditing
        ? await api.put(`/projects/admin/${project.id}`, payload, token)
        : await api.post('/projects/admin', payload, token);
      onSaved(response);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-2">
        <input className="input-shell" placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input-shell" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      </div>
      <input className="input-shell" placeholder="Sous-titre" value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      <textarea className="input-shell min-h-[90px]" placeholder="Description courte" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <textarea className="input-shell min-h-[180px]" placeholder="Description complete" value={form.long_description || ''} onChange={(e) => setForm({ ...form, long_description: e.target.value })} />
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <input className="input-shell" placeholder="Image URL" value={form.cover_url || ''} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} />
        <label className="button-secondary cursor-pointer">
          {uploading ? 'Upload...' : 'Uploader image'}
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>
      <input className="input-shell" placeholder="Stack liee (React, Node.js, MySQL)" value={form.tech_tags} onChange={(e) => setForm({ ...form, tech_tags: e.target.value })} />
      <div className="grid gap-4 lg:grid-cols-2">
        <input className="input-shell" placeholder="URL demo" value={form.live_url || ''} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
        <input className="input-shell" placeholder="URL GitHub" value={form.github_url || ''} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <select className="input-shell" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <input className="input-shell" type="number" placeholder="Ordre" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        <input className="input-shell" type="number" placeholder="Annee" value={form.year || ''} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-black/30 px-4 py-3 text-sm">
          <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="button-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : isEditing ? 'Mettre a jour' : 'Creer le projet'}
        </button>
        {onCancel && (
          <button type="button" className="button-secondary" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

function mapProjectToForm(project) {
  return {
    ...initialState,
    ...(project || {}),
    tech_tags: Array.isArray(project?.tech_tags) ? project.tech_tags.join(', ') : '',
  };
}
