import { useState } from 'react';
import { uiIcons } from '../../lib/icons';

function ProjectModal({ project, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <article
        className="panel relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        {project.cover_url && (
          <div className="relative h-56 overflow-hidden rounded-t-[2rem] border-b border-white/8">
            <img src={project.cover_url} alt={project.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="p-7">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">
            {project.year || 'Recent'} / {project.status || 'published'}
          </div>
          <h3 className="text-2xl font-medium">{project.title}</h3>

          <p className="mt-4 text-sm leading-7 text-muted-2">
            {project.long_description || project.description}
          </p>

          {(project.tech_tags || []).length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech_tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/72">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="button-primary gap-2">
                Look {uiIcons.external}
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="button-secondary">
                GitHub
              </a>
            )}
            <button onClick={onClose} className="button-secondary ml-auto">
              Fermer
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function ProjectsSection({ projects = [] }) {
  const [selected, setSelected] = useState(null);
  const spanClasses = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5'];

  return (
    <section id="projects" className="section-spacing border-b border-white/5">
      <div className="container-main">
        <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">Projects / Shipping / Products</div>
            <h2 className="mt-4 max-w-3xl text-heading">Une selection d'applications web et mobiles performantes, conçues pour le réel.</h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-muted-2">
            Découvrez une sélection de projets web et mobiles conçus pour être rapides, fiables et intuitifs. Que ce soit pour des applications métier, des outils sur mesure ou des interfaces utilisateurs, chaque projet est pensé pour répondre à un besoin concret avec une attention particulière à la performance, à l'expérience utilisateur.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {projects.map((project, index) => (
            <article
              key={project.id}
              onClick={() => setSelected(project)}
              className={`group panel cursor-pointer overflow-hidden rounded-[2rem] transition-transform duration-300 hover:scale-[1.015] ${spanClasses[index % spanClasses.length]}`}
            >
              {/* Cover */}
              <div className="relative min-h-[260px] overflow-hidden border-b border-white/8 bg-gradient-to-br from-white/5 via-transparent to-accent/10">
                {project.cover_url ? (
                  <img src={project.cover_url} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                ) : (
                  <div className="flex h-full min-h-[260px] items-end bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.3),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_30%)] p-6">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                      {project.slug}
                    </span>
                  </div>
                )}
              </div>

              {/* Card body — short info only */}
              <div className="p-6 lg:p-7">
                <div className="mb-2 text-xs uppercase tracking-[0.3em] text-muted">
                  {project.year || 'Recent'} / {project.status || 'published'}
                </div>
                <h3 className="text-xl font-medium">{project.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-2">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.tech_tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/72">
                      {tag}
                    </span>
                  ))}
                  {(project.tech_tags || []).length > 4 && (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
                      +{project.tech_tags.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}

          {!projects.length && (
            <div className="panel rounded-[2rem] p-8 text-sm text-muted-2 lg:col-span-12">
              Aucun projet publie. Ajoutez-en depuis l'admin pour alimenter automatiquement cette section.
            </div>
          )}
        </div>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
