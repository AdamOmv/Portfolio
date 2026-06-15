export default function AboutSection({ settings }) {
  return (
    <section id="about" className="section-spacing border-b border-white/5">
      <div className="container-main grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel rounded-[2rem] p-8 lg:p-10">
          <div className="eyebrow">About / Editorial profile</div>
          <h2 className="mt-5 text-heading">Je transforme des idées en applications web & mobile</h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-muted-2">
            {(settings.about_text || '').split('\n').filter(Boolean).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="panel rounded-[2rem] p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-muted">Specialite</div>
            <div className="mt-3 text-2xl font-medium">{settings.about_specialty || 'Full-stack development'}</div>
          </div>
          <div className="panel rounded-[2rem] p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-muted">Stack principale</div>
            <div className="mt-3 text-lg font-medium leading-8 text-white/90">
              {settings.about_main_stack || 'React, Node.js, MySQL, Docker'}
            </div>
          </div>
          <div className="panel rounded-[2rem] p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-muted">Approche</div>
            <div className="mt-3 text-lg leading-8 text-white/90">
              {settings.about_approach || 'Code propre, structure nette, attention constante au rendu et a la maintenabilite.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
