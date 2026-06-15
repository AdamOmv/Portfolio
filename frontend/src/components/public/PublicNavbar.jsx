import { useTheme } from '../../context/ThemeContext';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M21 14.3A8.6 8.6 0 1 1 9.7 3a7.1 7.1 0 0 0 11.3 11.3Z" />
    </svg>
  );
}

export default function PublicNavbar({ settings }) {
  const { theme, toggleTheme } = useTheme();
  const hasLogo = Boolean(settings.logo_url);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-base/75 backdrop-blur-xl">
      <div className="container-main flex items-center justify-between py-5">
        <a href="#top" className="flex items-center gap-3">
          {hasLogo ? (
            <img
              src={settings.logo_url}
              alt={settings.site_title || 'ADOMV'}
              className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 object-cover"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold tracking-[0.24em]">
              AV
            </span>
          )}
          <span className="text-sm uppercase tracking-[0.28em] text-muted-2">ADOMV</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-muted-2 md:flex">
          <a href="#projects" className="transition hover:text-white">Projets</a>
          <a href="#about" className="transition hover:text-white">Profil</a>
          <a href="#stack" className="transition hover:text-white">Stack</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <a href={`mailto:${settings.email_contact || 'contact@adomv.com'}`} className="button-secondary hidden sm:inline-flex">
            Disponibilite
          </a>
        </div>
      </div>
    </header>
  );
}
