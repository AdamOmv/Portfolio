import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'content', label: 'Content' },
  { id: 'messages', label: 'Messages' },
];

export default function AdminShell({ stats, children, activeTab, onChangeTab }) {
  const { user, logout } = useAuth();
  const statsItems = useMemo(() => [
    { label: 'Projects', value: stats?.projects?.total ?? 0 },
    { label: 'Published', value: stats?.projects?.published ?? 0 },
    { label: 'Unread', value: stats?.messages?.unread ?? 0 },
  ], [stats]);

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="force-dark-theme min-h-screen bg-base text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className={`border-r border-white/5 bg-black/30 p-6 backdrop-blur-xl ${mobileOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="mb-10">
            <div className="text-xs uppercase tracking-[0.3em] text-muted">Admin panel</div>
            <div className="mt-3 text-2xl font-medium">ADOMV</div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onChangeTab(tab.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${activeTab === tab.id ? 'bg-white text-base' : 'bg-white/5 text-white/75 hover:bg-white/8 hover:text-white'}`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-10 grid gap-3">
            {statsItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-muted">{item.label}</div>
                <div className="mt-2 text-2xl font-medium">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-muted-2">
            <div>{user?.username}</div>
            <button type="button" className="mt-3 text-white underline underline-offset-4" onClick={logout}>
              Se deconnecter
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="border-b border-white/5 bg-base/80 px-6 py-4 backdrop-blur-xl lg:px-8">
            <div className="flex items-center justify-between">
              <button type="button" className="button-secondary lg:hidden" onClick={() => setMobileOpen((value) => !value)}>
                Menu
              </button>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted">Back-office</div>
                <div className="mt-1 text-lg font-medium">{tabs.find((tab) => tab.id === activeTab)?.label}</div>
              </div>
            </div>
          </div>
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
