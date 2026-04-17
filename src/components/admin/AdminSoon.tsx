interface AdminSoonProps {
  title: string;
  description: string;
}

/** Shared placeholder for admin routes that aren't built yet. */
export default function AdminSoon({ title, description }: AdminSoonProps) {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">{title}</h1>
          <p className="admin-page__subtitle">{description}</p>
        </div>
      </header>

      <div className="admin-soon">
        <span className="admin-soon__badge">Próximamente</span>
        <h2 className="admin-soon__title">En construcción</h2>
        <p className="admin-soon__desc">
          Esta sección se está preparando. Por ahora, enfócate en <strong>Productos</strong> y
          <strong> Servicios</strong> — ahí están las secciones activas del CMS.
        </p>
      </div>
    </div>
  );
}
