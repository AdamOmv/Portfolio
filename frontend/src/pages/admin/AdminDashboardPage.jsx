import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../../components/admin/AdminShell';
import AdminSectionCard from '../../components/admin/AdminSectionCard';
import ProjectForm from '../../components/admin/ProjectForm';
import StackForm from '../../components/admin/StackForm';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

const contentFields = [
  ['logo_url', 'Logo header (URL)'],
  ['favicon_url', 'Favicon (URL)'],
  ['hero_name', 'Nom hero'],
  ['hero_tagline', 'Tagline hero'],
  ['hero_description', 'Description hero'],
  ['hero_primary_cta', 'CTA principal'],
  ['hero_secondary_cta', 'CTA secondaire'],
  ['about_text', 'Texte about'],
  ['about_specialty', 'Specialite'],
  ['about_main_stack', 'Stack principale'],
  ['about_approach', 'Approche'],
  ['contact_title', 'Titre contact'],
  ['contact_text', 'Texte contact'],
  ['email_contact', 'Email'],
  ['linkedin_url', 'LinkedIn'],
  ['github_url', 'GitHub'],
  ['footer_text', 'Footer'],
];

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [stack, setStack] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settingsRows, setSettingsRows] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [editingStack, setEditingStack] = useState(null);
  const [savingStack, setSavingStack] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [uploadingBrandKey, setUploadingBrandKey] = useState('');
  const [contentForm, setContentForm] = useState({});

  async function loadAll() {
    const [statsData, projectsData, stackData, settingsData, messagesData] = await Promise.all([
      api.get('/stats', token),
      api.get('/projects/admin/all', token),
      api.get('/stack/admin/all', token),
      api.get('/settings/admin/all', token),
      api.get('/contact/admin', token),
    ]);

    setStats(statsData);
    setProjects(projectsData);
    setStack(stackData);
    setMessages(messagesData);
    setSettingsRows(settingsData);
    setContentForm(settingsData.reduce((acc, row) => ({ ...acc, [row.key_name]: row.value || '' }), {}));
  }

  useEffect(() => {
    loadAll();
  }, [token]);

  const unreadMessages = useMemo(() => messages.filter((message) => !message.is_read), [messages]);

  async function handleProjectDelete(id) {
    await api.delete(`/projects/admin/${id}`, null, token);
    await loadAll();
  }

  async function handleProjectStatus(project, status) {
    await api.patch(`/projects/admin/${project.id}/status`, { status }, token);
    await loadAll();
  }

  async function handleStackSubmit(payload) {
    setSavingStack(true);
    try {
      if (editingStack?.id) {
        await api.put(`/stack/admin/${editingStack.id}`, payload, token);
      } else {
        await api.post('/stack/admin', payload, token);
      }
      setEditingStack(null);
      await loadAll();
    } finally {
      setSavingStack(false);
    }
  }

  async function handleStackDelete(id) {
    await api.delete(`/stack/admin/${id}`, null, token);
    await loadAll();
  }

  async function handleSaveContent(event) {
    event.preventDefault();
    setSavingContent(true);
    try {
      await api.put('/settings/admin', contentForm, token);
      await loadAll();
    } finally {
      setSavingContent(false);
    }
  }

  async function handleMarkRead(id) {
    await api.patch(`/contact/admin/${id}/read`, {}, token);
    await loadAll();
  }

  async function handleDeleteMessage(id) {
    await api.delete(`/contact/admin/${id}`, null, token);
    await loadAll();
  }

  async function handleBrandAssetUpload(key, file) {
    if (!file) return;
    setUploadingBrandKey(key);
    try {
      const payload = new FormData();
      payload.append('file', file);
      const response = await api.post('/upload', payload, token);
      setContentForm((current) => ({ ...current, [key]: response.url }));
    } finally {
      setUploadingBrandKey('');
    }
  }

  function isLongContentField(key) {
    return key.includes('text') || key.includes('description') || key === 'about_text';
  }

  function isBrandingField(key) {
    return key === 'logo_url' || key === 'favicon_url';
  }

  return (
    <AdminShell stats={stats} activeTab={activeTab} onChangeTab={setActiveTab}>
      <div className="grid gap-6">
        {activeTab === 'overview' && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Projects publies" value={stats?.projects?.published ?? 0} />
              <MetricCard label="Drafts" value={stats?.projects?.draft ?? 0} />
              <MetricCard label="Featured" value={stats?.projects?.featured ?? 0} />
              <MetricCard label="Messages non lus" value={stats?.messages?.unread ?? 0} accent />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <AdminSectionCard title="Acces rapide" description="Les donnees ici pilotent directement le site public racine.">
                <div className="grid gap-3 sm:grid-cols-2">
                  <QuickAction label="Nouveau projet" onClick={() => { setEditingProject({}); setActiveTab('projects'); }} />
                  <QuickAction label="Ajouter une techno" onClick={() => { setEditingStack({}); setActiveTab('stack'); }} />
                  <QuickAction label="Modifier les contenus" onClick={() => setActiveTab('content')} />
                  <QuickAction label={`Messages (${unreadMessages.length})`} onClick={() => setActiveTab('messages')} />
                </div>
              </AdminSectionCard>

              <AdminSectionCard title="Cohabitation domaine" description="Le portfolio reste a la racine du domaine. Le projet undercover reste servi sur /undercover via une location dediee.">
                <div className="code-block text-muted-2">
                  / - frontend portfolio React<br />
                  /api - backend portfolio Node.js<br />
                  /uploads - assets portfolio<br />
                  /undercover - autre projet separe
                </div>
              </AdminSectionCard>
            </div>
          </>
        )}

        {activeTab === 'projects' && (
          <>
            <AdminSectionCard
              title={editingProject?.id ? 'Editer le projet' : 'Nouveau projet'}
              description="CRUD complet des projets avec image, ordre, featured et publication."
            >
              <ProjectForm
                token={token}
                project={editingProject}
                onSaved={async () => {
                  setEditingProject(null);
                  await loadAll();
                }}
                onCancel={() => setEditingProject(null)}
              />
            </AdminSectionCard>

            <AdminSectionCard title="Liste des projets">
              <div className="overflow-x-auto">
                <table className="admin-table min-w-full">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Slug</th>
                      <th>Ordre</th>
                      <th>Statut</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td className="text-muted-2">{project.slug}</td>
                        <td>{project.sort_order}</td>
                        <td>{project.status}</td>
                        <td>{project.featured ? 'Oui' : 'Non'}</td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <button className="button-secondary !px-3 !py-2" onClick={() => setEditingProject(project)}>Editer</button>
                            <button className="button-secondary !px-3 !py-2" onClick={() => handleProjectStatus(project, project.status === 'published' ? 'draft' : 'published')}>
                              {project.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button className="button-secondary !px-3 !py-2 text-danger" onClick={() => handleProjectDelete(project.id)}>Supprimer</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!projects.length && (
                      <tr>
                        <td colSpan="6" className="text-muted-2">Aucun projet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AdminSectionCard>
          </>
        )}

        {activeTab === 'stack' && (
          <>
            <AdminSectionCard title={editingStack?.id ? 'Editer la techno' : 'Nouvelle techno'} description="Gestion de l’ordre, du niveau, du statut actif et du role principal.">
              <StackForm item={editingStack} onSubmit={handleStackSubmit} onCancel={() => setEditingStack(null)} loading={savingStack} />
            </AdminSectionCard>

            <AdminSectionCard title="Liste de la stack">
              <div className="overflow-x-auto">
                <table className="admin-table min-w-full">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Categorie</th>
                      <th>Icon</th>
                      <th>Main</th>
                      <th>Active</th>
                      <th>Ordre</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stack.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.icon_slug}</td>
                        <td>{item.is_main ? 'Oui' : 'Non'}</td>
                        <td>{item.is_active ? 'Oui' : 'Non'}</td>
                        <td>{item.sort_order}</td>
                        <td>
                          <div className="flex gap-2">
                            <button className="button-secondary !px-3 !py-2" onClick={() => setEditingStack(item)}>Editer</button>
                            <button className="button-secondary !px-3 !py-2 text-danger" onClick={() => handleStackDelete(item.id)}>Supprimer</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!stack.length && (
                      <tr>
                        <td colSpan="7" className="text-muted-2">Aucune techno.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AdminSectionCard>
          </>
        )}

        {activeTab === 'content' && (
          <AdminSectionCard title="Contenus editables" description="Textes hero, about, contact, CTA, footer et liens publics.">
            <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSaveContent}>
              {contentFields.map(([key, label]) => (
                <label key={key} className={`grid gap-2 ${isLongContentField(key) ? 'lg:col-span-2' : ''}`}>
                  <span className="text-sm text-muted-2">{label}</span>
                  {isLongContentField(key) ? (
                    <textarea className="input-shell min-h-[140px]" value={contentForm[key] || ''} onChange={(e) => setContentForm({ ...contentForm, [key]: e.target.value })} />
                  ) : (
                    <div className="grid gap-3">
                      <div className={`grid gap-3 ${isBrandingField(key) ? 'sm:grid-cols-[1fr_auto]' : ''}`}>
                        <input className="input-shell" value={contentForm[key] || ''} onChange={(e) => setContentForm({ ...contentForm, [key]: e.target.value })} />
                        {isBrandingField(key) && (
                          <label className="button-secondary cursor-pointer justify-center">
                            {uploadingBrandKey === key ? 'Upload...' : 'Uploader'}
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(event) => handleBrandAssetUpload(key, event.target.files?.[0])}
                            />
                          </label>
                        )}
                      </div>
                      {isBrandingField(key) && contentForm[key] && (
                        <div className="rounded-xl border border-border bg-surface/60 p-3">
                          {key === 'logo_url' ? (
                            <img src={contentForm[key]} alt="Apercu logo" className="h-12 w-12 rounded-lg object-cover" />
                          ) : (
                            <img src={contentForm[key]} alt="Apercu favicon" className="h-8 w-8 rounded object-cover" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </label>
              ))}
              <div className="lg:col-span-2">
                <button className="button-primary" disabled={savingContent}>
                  {savingContent ? 'Enregistrement...' : 'Sauvegarder les contenus'}
                </button>
              </div>
            </form>
          </AdminSectionCard>
        )}

        {activeTab === 'messages' && (
          <AdminSectionCard title="Messages de contact" description="Consultation, marquage lu et suppression.">
            <div className="grid gap-4">
              {messages.map((message) => (
                <article key={message.id} className={`rounded-[1.75rem] border p-5 ${message.is_read ? 'border-white/8 bg-white/5' : 'border-accent/30 bg-accent/5'}`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-sm text-muted-2">{message.email}</div>
                      <h3 className="mt-1 text-lg font-medium">{message.subject || `Message de ${message.name}`}</h3>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/80">{message.message}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!message.is_read && <button className="button-secondary" onClick={() => handleMarkRead(message.id)}>Marquer lu</button>}
                      <button className="button-secondary text-danger" onClick={() => handleDeleteMessage(message.id)}>Supprimer</button>
                    </div>
                  </div>
                </article>
              ))}
              {!messages.length && <div className="text-sm text-muted-2">Aucun message recu.</div>}
            </div>
          </AdminSectionCard>
        )}
      </div>
    </AdminShell>
  );
}

function MetricCard({ label, value, accent = false }) {
  return (
    <div className={`panel rounded-[1.75rem] p-6 ${accent ? 'border-accent/30' : ''}`}>
      <div className="text-xs uppercase tracking-[0.25em] text-muted">{label}</div>
      <div className="mt-4 text-4xl font-medium">{value}</div>
    </div>
  );
}

function QuickAction({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 text-left text-sm transition hover:border-accent/40 hover:bg-white/8">
      {label}
    </button>
  );
}
