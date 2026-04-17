import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../core/supabase';

export default function AdminDashboard() {
  const [counts, setCounts] = useState<{ products: number; services: number; pendingTestimonials: number } | null>(null);

  useEffect(() => {
    (async () => {
      const [p, s, t] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      setCounts({
        products: p.count ?? 0,
        services: s.count ?? 0,
        pendingTestimonials: t.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Panel de administración</h1>
          <p className="admin-page__subtitle">
            Gestiona el catálogo, servicios y contenido de Greenlabs Botanics.
          </p>
        </div>
      </header>

      <section className="admin-dashboard__grid">
        <div className="admin-dashboard__card">
          <span className="admin-dashboard__card-label">Productos activos</span>
          <span className="admin-dashboard__card-value">{counts?.products ?? '—'}</span>
          <span className="admin-dashboard__card-sub">Publicados en el catálogo</span>
        </div>
        <div className="admin-dashboard__card">
          <span className="admin-dashboard__card-label">Servicios activos</span>
          <span className="admin-dashboard__card-value">{counts?.services ?? '—'}</span>
          <span className="admin-dashboard__card-sub">Visibles en la página de servicios</span>
        </div>
        <div className="admin-dashboard__card">
          <span className="admin-dashboard__card-label">Testimonios por revisar</span>
          <span className="admin-dashboard__card-value">{counts?.pendingTestimonials ?? '—'}</span>
          <span className="admin-dashboard__card-sub">Pendientes de moderación</span>
        </div>
      </section>

      <section className="admin-dashboard__shortcuts">
        <Link to="/admin/productos" className="admin-dashboard__shortcut">
          <h2 className="admin-dashboard__shortcut-title">Gestionar productos →</h2>
          <p className="admin-dashboard__shortcut-desc">
            Editar suculentas, subir fotos, controlar stock y destacar en el catálogo.
          </p>
        </Link>
        <Link to="/admin/servicios" className="admin-dashboard__shortcut">
          <h2 className="admin-dashboard__shortcut-title">Gestionar servicios →</h2>
          <p className="admin-dashboard__shortcut-desc">
            Actualizar paquetes para bodas, cumpleaños, corporativos y sus fotos.
          </p>
        </Link>
      </section>
    </div>
  );
}
