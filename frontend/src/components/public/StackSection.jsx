import { resolveTechIcon } from '../../lib/icons';

function StackItem({ item }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-5 py-3 backdrop-blur-sm select-none shrink-0">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 bg-white/6 text-white">
        {resolveTechIcon(item.icon_slug)}
      </span>
      <span className="text-sm font-medium text-white/90 whitespace-nowrap">{item.name}</span>
      {item.is_main && (
        <span className="rounded-full bg-accent/12 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-accent">
          Main
        </span>
      )}
    </div>
  );
}

export default function StackSection({ stack = [] }) {
  if (!stack.length) {
    return (
      <section id="stack" className="section-spacing border-b border-white/5">
        <div className="container-main">
          <p className="text-sm text-muted-2">Aucune techno active. Activez des items dans l'admin.</p>
        </div>
      </section>
    );
  }

  // Split into two rows for visual variety
  const mid = Math.ceil(stack.length / 2);
  const row1 = stack.slice(0, mid);
  const row2 = stack.slice(mid);

  return (
    <section id="stack" className="section-spacing border-b border-white/5 overflow-hidden">
      <div className="container-main mb-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">Core stack / Tools / Delivery</div>
            <h2 className="mt-5 text-heading">
              Les technologies que j'utilise pour donner vie à vos projets.
            </h2>
          </div>
          <div className="max-w-md text-sm leading-7 text-muted-2">
            Je privilégie la qualité à la quantité : mieux vaut maîtriser une poignée de technologies et les utiliser à bon escient, que de s'éparpiller sur une multitude d'outils sans les dompter.
          </div>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div className="relative mb-4">
        <div className="flex marquee-track" style={{ '--duration': `${Math.max(20, row1.length * 3)}s` }}>
          {[...row1, ...row1].map((item, i) => (
            <div key={`r1-${i}`} className="px-2">
              <StackItem item={item} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-base to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-base to-transparent z-10" />
      </div>

      {/* Row 2 — right to left */}
      {row2.length > 0 && (
        <div className="relative">
          <div className="flex marquee-track marquee-reverse" style={{ '--duration': `${Math.max(20, row2.length * 3)}s` }}>
            {[...row2, ...row2].map((item, i) => (
              <div key={`r2-${i}`} className="px-2">
                <StackItem item={item} />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-base to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-base to-transparent z-10" />
        </div>
      )}
    </section>
  );
}
