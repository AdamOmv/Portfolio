import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { token, login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.username, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="force-dark-theme flex min-h-screen items-center justify-center bg-base px-6 text-white">
      <div className="panel noise w-full max-w-md rounded-[2rem] p-8">
        <div className="eyebrow">Admin / Secure access</div>
        <h1 className="mt-5 text-3xl font-medium">Connexion back-office</h1>
        <p className="mt-3 text-sm leading-7 text-muted-2">
          Interface de pilotage du portfolio public, des contenus et de la stack technique.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <input className="input-shell" placeholder="Username ou email" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="input-shell" type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div className="text-sm text-danger">{error}</div>}
          <button className="button-primary" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
