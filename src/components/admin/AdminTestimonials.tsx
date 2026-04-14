import { useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Placeholder data until Supabase is connected
const mockTestimonials: Testimonial[] = [
  { id: '1', name: 'María R.', text: 'Mis suculentas llegaron perfectas. El empaque fue increíble.', rating: 5, status: 'approved', created_at: '2026-04-01' },
  { id: '2', name: 'Carlos M.', text: 'Greenlabs me enseñó a cuidar mis suculentas. Ahora tengo 12.', rating: 5, status: 'approved', created_at: '2026-04-03' },
  { id: '3', name: 'Ana P.', text: 'La mejor tienda de suculentas en Santiago.', rating: 4, status: 'approved', created_at: '2026-04-05' },
  { id: '4', name: 'José L.', text: 'Excelente atención y las suculentas llegaron en perfecto estado. Muy recomendado.', rating: 5, status: 'pending', created_at: '2026-04-12' },
  { id: '5', name: 'Laura G.', text: 'Buen servicio pero el envío tardó un poco más de lo esperado.', rating: 3, status: 'pending', created_at: '2026-04-11' },
];

const statusLabels = { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado' };
const statusColors = { pending: '#d4a017', approved: '#8BA740', rejected: '#EF583D' };

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filtered = filter === 'all' ? testimonials : testimonials.filter(t => t.status === filter);
  const pendingCount = testimonials.filter(t => t.status === 'pending').length;

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    // TODO: Update in Supabase when credentials available
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-editorial)', color: 'var(--color-forest)', margin: 0 }}>
          Testimonios
          {pendingCount > 0 && (
            <span style={{ fontSize: '14px', background: '#d4a017', color: 'white', borderRadius: '12px', padding: '2px 10px', marginLeft: '12px', fontFamily: 'var(--font-ui)' }}>
              {pendingCount} pendientes
            </span>
          )}
        </h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: filter === f ? '2px solid var(--color-forest)' : '1px solid #ddd',
              background: filter === f ? 'var(--color-forest)' : 'white',
              color: filter === f ? 'var(--color-sand)' : 'var(--color-forest)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {f === 'all' ? `Todos (${testimonials.length})` : `${statusLabels[f]} (${testimonials.filter(t => t.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Testimonial list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(t => (
          <div
            key={t.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: t.status === 'pending' ? '2px solid #d4a017' : '1px solid #eee',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <strong style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-ui)' }}>{t.name}</strong>
                <span style={{ marginLeft: '12px', color: '#c9b23c' }}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: statusColors[t.status], textTransform: 'uppercase', letterSpacing: '1px' }}>
                {statusLabels[t.status]}
              </span>
            </div>

            <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.6, margin: '0 0 12px' }}>"{t.text}"</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#999' }}>{t.created_at}</span>

              {t.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => updateStatus(t.id, 'approved')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#8BA740',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => updateStatus(t.id, 'rejected')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      background: 'white',
                      color: '#EF583D',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
