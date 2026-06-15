export default function AdminSectionCard({ title, description, actions, children }) {
  return (
    <section className="panel rounded-[2rem] p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-2">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
