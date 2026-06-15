import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  category: 'frontend',
  icon_slug: '',
  proficiency: 80,
  is_main: false,
  is_active: true,
  sort_order: 0,
};

export default function StackForm({ item, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(() => mapStackItemToForm(item));

  useEffect(() => {
    setForm(mapStackItemToForm(item));
  }, [item]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      proficiency: Number(form.proficiency) || 0,
      sort_order: Number(form.sort_order) || 0,
    });
  }

  return (
    <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
      <input className="input-shell" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input-shell" placeholder="Icon slug (react, docker, mysql)" value={form.icon_slug || ''} onChange={(e) => setForm({ ...form, icon_slug: e.target.value })} />
      <select className="input-shell" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="devops">DevOps</option>
        <option value="design">Design</option>
        <option value="other">Other</option>
      </select>
      <input className="input-shell" type="number" placeholder="Proficiency" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: e.target.value })} />
      <input className="input-shell" type="number" placeholder="Ordre" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-black/30 px-4 py-3 text-sm">
          <input type="checkbox" checked={Boolean(form.is_main)} onChange={(e) => setForm({ ...form, is_main: e.target.checked })} />
          Main
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-black/30 px-4 py-3 text-sm">
          <input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active
        </label>
      </div>
      <div className="lg:col-span-2 flex flex-wrap gap-3">
        <button className="button-primary" disabled={loading}>
          {loading ? 'Enregistrement...' : item ? 'Mettre a jour' : 'Ajouter la techno'}
        </button>
        {onCancel && <button type="button" className="button-secondary" onClick={onCancel}>Annuler</button>}
      </div>
    </form>
  );
}

function mapStackItemToForm(item) {
  return { ...initialState, ...(item || {}) };
}
