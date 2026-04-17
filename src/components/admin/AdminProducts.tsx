import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../core/supabase';
import { deleteImage } from '../../lib/storage';
import ImageUploader from '../ui/ImageUploader';
import type { Product, Category } from '../../lib/types';
import '../../styles/components/admin-products.css';

type FormData = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>;

const EMPTY_FORM: FormData = {
  name: '',
  slug: '',
  description: null,
  price: 0,
  images: [],
  care_guide: null,
  category_id: null,
  light_needs: null,
  water_needs: null,
  is_featured: false,
  stock: 0,
  is_active: true,
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    if (prodRes.error) setError(prodRes.error.message);
    if (catRes.error) setError(catRes.error.message);
    setProducts((prodRes.data as Product[]) || []);
    setCategories((catRes.data as Category[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setError(null);
    setDrawerOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      care_guide: product.care_guide,
      category_id: product.category_id,
      light_needs: product.light_needs,
      water_needs: product.water_needs,
      is_featured: product.is_featured,
      stock: product.stock,
      is_active: product.is_active,
    });
    setError(null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
      slug: editingProduct ? f.slug : slugify(name),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('El nombre y el slug son requeridos.');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      ...(editingProduct ? { id: editingProduct.id } : {}),
    };

    const { error: err } = await supabase.from('products').upsert(payload);
    setSaving(false);

    if (err) {
      setError(err.message);
    } else {
      closeDrawer();
      fetchData();
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    setError(null);

    // Delete storage images first
    if (deleteConfirm.images.length > 0) {
      await Promise.allSettled(deleteConfirm.images.map(url => deleteImage(url)));
    }

    const { error: err } = await supabase.from('products').delete().eq('id', deleteConfirm.id);
    setDeleting(false);
    if (err) {
      setError(`No se pudo eliminar: ${err.message}`);
      return;
    }
    setDeleteConfirm(null);
    fetchData();
  };

  const handleToggleActive = async (product: Product) => {
    const { error: err } = await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
    if (err) { setError(`No se pudo actualizar: ${err.message}`); return; }
    fetchData();
  };

  return (
    <div className="admin-products">
      {/* Header */}
      <div className="admin-products__header">
        <h1 className="admin-products__title">Productos</h1>
        <button className="admin-products__new-btn" onClick={openNew} type="button">
          + Nuevo producto
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="admin-products__loading">Cargando productos…</div>
      ) : (
        <div className="admin-products__table-wrap">
          <table className="admin-products__table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className={!p.is_active ? 'admin-products__row--inactive' : ''}>
                  <td>
                    <div className="admin-products__product-name">
                      {p.images[0] && (
                        <img src={p.images[0]} alt="" className="admin-products__thumb" />
                      )}
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td>RD$ {p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className={`admin-products__toggle${p.is_active ? ' admin-products__toggle--on' : ''}`}
                      onClick={() => handleToggleActive(p)}
                      type="button"
                      title={p.is_active ? 'Desactivar' : 'Activar'}
                    >
                      {p.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-products__actions">
                      <button className="admin-products__edit-btn" onClick={() => openEdit(p)} type="button">Editar</button>
                      <button className="admin-products__delete-btn" onClick={() => setDeleteConfirm(p)} type="button">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-products__empty-row">No hay productos aún.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Side Drawer */}
      {drawerOpen && (
        <div className="admin-drawer-overlay" onClick={closeDrawer}>
          <div
            className="admin-drawer"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label={editingProduct ? 'Editar producto' : 'Nuevo producto'}
          >
            <div className="admin-drawer__header">
              <h2 className="admin-drawer__title">
                {editingProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button className="admin-drawer__close" onClick={closeDrawer} type="button" aria-label="Cerrar">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" />
                </svg>
              </button>
            </div>

            <div className="admin-drawer__body">
              {error && <div className="admin-drawer__error">{error}</div>}

              <div className="admin-form__group">
                <label className="admin-form__label">Nombre *</label>
                <input className="admin-form__input" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Echeveria 'Hercules'" />
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Slug *</label>
                <input className="admin-form__input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="echeveria-hercules" />
              </div>

              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label className="admin-form__label">Precio (RD$) *</label>
                  <input className="admin-form__input" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="admin-form__group">
                  <label className="admin-form__label">Stock</label>
                  <input className="admin-form__input" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Categoría</label>
                <select className="admin-form__select" value={form.category_id || ''} onChange={e => setForm(f => ({ ...f, category_id: e.target.value || null }))}>
                  <option value="">Sin categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label className="admin-form__label">Necesidad de luz</label>
                  <select className="admin-form__select" value={form.light_needs || ''} onChange={e => setForm(f => ({ ...f, light_needs: (e.target.value || null) as Product['light_needs'] }))}>
                    <option value="">—</option>
                    <option value="low">Poca luz</option>
                    <option value="medium">Luz indirecta</option>
                    <option value="high">Luz directa</option>
                  </select>
                </div>
                <div className="admin-form__group">
                  <label className="admin-form__label">Necesidad de agua</label>
                  <select className="admin-form__select" value={form.water_needs || ''} onChange={e => setForm(f => ({ ...f, water_needs: (e.target.value || null) as Product['water_needs'] }))}>
                    <option value="">—</option>
                    <option value="low">Riego mínimo</option>
                    <option value="medium">Riego moderado</option>
                    <option value="high">Riego frecuente</option>
                  </select>
                </div>
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Descripción</label>
                <textarea className="admin-form__textarea" rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value || null }))} />
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Guía de cuidado</label>
                <textarea className="admin-form__textarea" rows={3} value={form.care_guide || ''} onChange={e => setForm(f => ({ ...f, care_guide: e.target.value || null }))} />
              </div>

              <div className="admin-form__row admin-form__row--checks">
                <label className="admin-form__check">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                  Producto destacado
                </label>
                <label className="admin-form__check">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                  Activo en catálogo
                </label>
              </div>

              <div className="admin-form__group">
                <label className="admin-form__label">Fotos (máx. 6)</label>
                <ImageUploader
                  value={form.images}
                  onChange={urls => setForm(f => ({ ...f, images: urls }))}
                  folder={`products/${form.slug || 'nuevo'}`}
                  maxFiles={6}
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

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm">
            <h3 className="admin-confirm__title">¿Eliminar "{deleteConfirm.name}"?</h3>
            <p className="admin-confirm__text">
              Esta acción eliminará el producto y todas sus fotos. No se puede deshacer.
            </p>
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
