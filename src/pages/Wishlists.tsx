import { Link } from 'react-router-dom';
import { useWishlist } from '../core/wishlist/WishlistProvider';
import '../styles/pages/account.css';
import '../styles/components/button.css';

export default function Wishlists() {
  const { wishlists, createWishlist } = useWishlist();

  return (
    <div className="account-page">
      <div className="account-page__header">
        <h1 className="account-page__title">Mis Listas</h1>
        <button className="btn btn--outline" onClick={() => createWishlist('Nueva Lista')}>Crear Lista</button>
      </div>

      {wishlists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">❤️</div>
          <h2 className="empty-state__title">No tienes listas aún</h2>
          <p className="empty-state__text">Crea una lista para guardar tus suculentas favoritas</p>
          <Link to="/catalogo" className="btn btn--primary">Explorar suculentas</Link>
        </div>
      ) : (
        <div className="wishlists__list">
          {wishlists.map(wl => (
            <div key={wl.id} className="wishlist-card">
              <h3 className="wishlist-card__name">{wl.name}</h3>
              <p className="wishlist-card__count">{wl.items?.length || 0} suculentas</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
