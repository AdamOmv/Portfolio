import { uiIcons } from '../../lib/icons';

export default function HeroSection({ settings, featuredProjects = [] }) {
  return (
    <section id="top" className="relative overflow-hidden border-b border-white/5">
      <div className="container-main relative grid gap-16 py-16 lg:grid-cols-[1.3fr_0.9fr] lg:py-24">
        <div className="max-w-3xl">
          <div className="eyebrow mb-8">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
            Portfolio / Full-stack / UI systems
          </div>

          <h1 className="max-w-4xl text-display text-balance">
            {settings.hero_name || 'Adam Oumarov'}
            <span className="mt-3 block text-white/42">
              {settings.hero_tagline || 'Des experiences web nettes, rapides et durables.'}
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-2">
            {settings.hero_description || 'Je conçois des produits web premium, du front visible au socle technique qui tient la charge.'}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#projects" className="button-primary gap-2">
              {settings.hero_primary_cta || 'Voir projets'}
              {uiIcons.arrow}
            </a>
            <a href="#contact" className="button-secondary">
              {settings.hero_secondary_cta || 'Contact'}
            </a>
          </div>
        </div>

        <div className="panel noise relative overflow-hidden rounded-[2rem] p-6">
          <div className="mac-window-bar mb-6">
            <span className="mac-dot mac-dot-red" />
            <span className="mac-dot mac-dot-yellow" />
            <span className="mac-dot mac-dot-green" />
          </div>

          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-2">Selected work</span>
            <span className="text-xs text-accent">{featuredProjects.length} projets mis en avant</span>
          </div>

          <div className="space-y-5">
            {featuredProjects.slice(0, 3).map((project, index) => (
              <article key={project.id} className="group rounded-3xl border border-border bg-surface-2/85 p-5 transition duration-300 hover:border-accent/30 hover:bg-surface-2">
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-muted">
                  <span>0{index + 1}</span>
                  <span>{project.year || 'Now'}</span>
                </div>
                <h3 className="text-xl font-medium">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-2">{project.subtitle || project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.tech_tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full border border-border-light px-3 py-1 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            {!featuredProjects.length && (
              <div className="rounded-3xl border border-dashed border-white/10 p-6 text-sm text-muted-2">
                Aucun projet featured pour le moment. L’admin peut en publier depuis le back-office.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
