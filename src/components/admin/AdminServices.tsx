import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../core/supabase';
import { deleteImage } from '../../lib/storage';
import ImageUploader from '../ui/ImageUploader';
import type { Service } from '../../lib/types';
import '../../styles/components/admin-products.css';

type FormData = Omit<Service, 'id' | 'created_at' | 'updated_at'>;

const EMPTY_FORM: FormData = {
  name: '',
  slug: '',
  description: null,
  price_range: null,
  images: [],
  is_active: true,
  sort_order: 0,
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dragSource = useRef<number | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    const { data, error: err } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (err) setError(err.message);
    setServices((data as Service[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openNew = () => {
    setEditingService(null);
    setForm({ ...EMPTY_FORM, sort_order: services.length });
    setError(null);
    setDrawerOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      slug: service.slug,
      description: service.description,
      price_range: service.price_range,
      images: service.images,
      is_active: service.is_active,
      sort_order: service.sort_order,
    });
    setError(null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); setEditingService(null); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('El nombre y el slug son requeridos.');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      ...(editingService ? { id: editingService.id } : {}),
    };

    const { error: err } = await supabase.from('services').upsert(payload);
    setSaving(false);
    if (err) { setError(err.message); }
    else { closeDrawer(); fetchServices(); }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    setError(null);
    if (deleteConfirm.images.length > 0) {
      await Promise.allSettled(deleteConfirm.images.map(url => deleteImage(url)));
    }
    const { error: err } = await supabase.from('services').delete().eq('id', deleteConfirm.id);
    setDeleting(false);
    if (err) { setError(`No se pudo eliminar: ${err.message}`); return; }
    setDeleteConfirm(null);
    fetchServices();
  };

  const handleToggleActive = async (service: Service) => {
    const { error: err } = await supabase.from('services').update({ is_active: !service.is_active }).eq('id', service.id);
    if (err) { setError(`No se pudo actualizar: ${err.message}`); return; }
    fetchServices();
  };

  // Drag-to-reorder rows
  const handleRowDragStart = (index: number) => { dragSource.current = index; };

  const handleRowDrop = async (targetIndex: number) => {
    const src = dragSource.current;
    if (src === null || src === targetIndex) { dragSource.current = null; return; }

    const reordered = [...services];
    const [moved] = reordered.splice(src, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update sort_order for affected rows
    const updates = reordered.map((s, i) => ({ id: s.id, sort_order: i }));
    setServices(reordered.map((s, i) => ({ ...s, sort_order: i })));

    await Promise.all(
      updates.map(u => supabase.from('services').update({ sort_order: u.sort_order }).eq('id', u.id))
    );
    dragSource.current = null;
  };

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <h1 className="admin-products__title">Servicios</h1>
        <button className="admin-products__new-btn" onClick={openNew} type="button">
          + Nuevo servicio
        </button>
      </div>

      {isLoading ? (
        <div className="admin-products__loading">Cargando servicios…</div>
      ) : (
        <div className="admin-products__table-wrap">
          <p className="admin-products__hint">Arrastra la fila para reordenar.</p>
          <table className="admin-products__table">
            <thead>
              <tr>
                <th style={{ width: 32 }} aria-label="Reordenar" />
                <th>Nombre</th>
                <th>Precio/rango</th>
                <th>Orden</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr
                  key={s.id}
                  draggable
                  onDragStart={() => handleRowDragStart(i)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleRowDrop(i)}
                  className={!s.is_active ? 'admin-products__row--inactive' : ''}
                >
                  <td className="admin-products__drag-handle" title="Arrastrar">
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" style={{ color: 'var(--color-gray-400)' }}>
                      <rect x="4" y="4" width="2" height="2" rx="1" /><rect x="9" y="4" width="2" height="2" rx="1" /><rect x="14" y="4" width="2" height="2" rx="1" />
                      <rect x="4" y="9" width="2" height="2" rx="1" /><rect x="9" y="9" width="2" height="2" rx="1" /><rect x="14" y="9" width="2" height="2" rx="1" />
                      <rect x="4" y="14" width="2" height="2" rx="1" /><rect x="9" y="14" width="2" height="2" rx="1" /><rect x="14" y="14" width="2" height="2" rx="1" />
                    </svg>
                  </td>
                  <td>
                    <div className="admin-products__product-name">
                      {s.images[0] && <img src={s.images[0]} alt="" className="admin-products__thumb" />}
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td>{s.price_range || '—'}</td>
                  <td>{s.sort_order}</td>
                  <td>
                    <button
                      className={`admin-products__toggle${s.is_active ? ' admin-products__toggle--on' : ''}`}
                      onClick={() => handleToggleActive(s)}
                      type="button"
                    >
                      {s.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-products__actions">
                      <button className="admin-products__edit-btn" onClick={() => openEdit(s)} type="button">Editar</button>
                      <button className="admin-products__delete-btn" onClick={() => setDeleteConfirm(s)} type="button">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={6} className="admin-products__empty-row">No hay servicios aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="admin-drawer-overlay" onClick={closeDrawer}>
          <div className="admin-drawer" onClick={e => e.stopPropagation()} role="dialog" aria-label={editingService ? 'Editar servicio' : 'Nuevo servicio'}>
            <div className="admin-drawer__header">
              <h2 className="admin-drawer__title">{editingService ? 'Editar servicio' : 'Nuevo servicio'}</h2>
              <button className="admin-drawer__close" onClick={closeDrawer} type="button" aria-label="Cerrar">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></svg>
              </button>
            </div>
            <div className="admin-drawer__body">
              {error && <div className="admin-drawer__error">{error}</div>}

              <div className="admin-form__group">
                <label className="admin-form__label">Nombre *</label>
                <input className="admin-form__input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editingService ? f.slug : slugify(e.target.value) }))} />
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Slug *</label>
                <input className="admin-form__input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
              </div>

              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label className="admin-form__label">Rango de precio</label>
                  <input className="admin-form__input" value={form.price_range || ''} onChange={e => setForm(f => ({ ...f, price_range: e.target.value || null }))} placeholder="Desde RD$ 200/u" />
                </div>
                <div className="admin-form__group">
                  <label className="admin-form__label">Orden</label>
                  <input className="admin-form__input" type="number" min="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Descripción</label>
                <textarea className="admin-form__textarea" rows={4} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value || null }))} />
              </div>

              <label className="admin-form__check">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                Servicio activo
              </label>

              <div className="admin-form__group" style={{ marginTop: 'var(--space-4)' }}>
                <label className="admin-form__label">Foto del servicio (máx. 1)</label>
                <ImageUploader
                  value={form.images}
                  onChange={urls => setForm(f => ({ ...f, images: urls.slice(0, 1) }))}
                  folder={`services/${form.slug || 'nuevo'}`}
                  maxFiles={1}
                />
              </div>
            </div>
            <div className="admin-drawer__footer">
              <button className="admin-drawer__cancel" onClick={closeDrawer} type="button">Cancelar</button>
              <button className="admin-drawer__save" onClick={handleSave} type="button" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm">
            <h3 className="admin-confirm__title">¿Eliminar "{deleteConfirm.name}"?</h3>
            <p className="admin-confirm__text">Esta acción es permanente y eliminará la foto del servicio.</p>
            <div className="admin-confirm__actions">
              <button className="admin-confirm__cancel" onClick={() => setDeleteConfirm(null)} type="button">Cancelar</button>
              <button className="admin-confirm__delete" onClick={confirmDelete} type="button" disabled={deleting}>
                {deleting ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
