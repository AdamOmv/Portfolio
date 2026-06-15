import { useState } from 'react';
import { api } from '../../lib/api';

export default function ContactSection({ settings }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);

    try {
      await api.post('/contact', form);
      setFeedback({ type: 'success', message: 'Message envoye. Je reviens vers vous rapidement.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="section-spacing">
      <div className="container-main">
        <div className="panel relative overflow-hidden rounded-[2.25rem] p-8 lg:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.18),transparent_55%)] lg:block" />
          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="eyebrow">Contact / Collaboration / Production</div>
              <h2 className="mt-4 max-w-lg text-heading">{settings.contact_title || 'Parlons de votre prochain projets.'}</h2>
              <p className="mt-5 max-w-md text-base leading-8 text-muted-2">
                {settings.contact_text || 'Disponible pour concevoir, refondre ou structurer un produit avec un vrai niveau d’exigence sur le front et l’architecture.'}
              </p>

              <div className="mt-8 space-y-3 text-sm text-white/80">
                <a className="block transition hover:text-accent" href={`mailto:${settings.email_contact || 'contact@adomv.com'}`}>
                  {settings.email_contact || 'contact@adomv.com'}
                </a>
                {settings.linkedin_url && <a className="block transition hover:text-accent" href={settings.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}
                {settings.github_url && <a className="block transition hover:text-accent" href={settings.github_url} target="_blank" rel="noreferrer">GitHub</a>}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input className="input-shell" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid gap-4 md:grid-cols-2">
                <input className="input-shell" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="input-shell" placeholder="Sujet" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <textarea className="input-shell min-h-[180px] resize-y" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button disabled={sending} className="button-primary disabled:cursor-not-allowed disabled:opacity-70">
                  {sending ? 'Envoi...' : 'Envoyer le message'}
                </button>
                {feedback && (
                  <p className={`text-sm ${feedback.type === 'success' ? 'text-accent' : 'text-danger'}`}>
                    {feedback.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
