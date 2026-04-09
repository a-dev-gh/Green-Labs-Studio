import { Link } from 'react-router-dom';
import '../styles/pages/account.css';
import '../styles/components/badge.css';

export default function Orders() {
  return (
    <div className="account-page">
      <h1 className="account-page__title">Mis Pedidos</h1>
      <div className="empty-state">
        <div className="empty-state__icon">📦</div>
        <h2 className="empty-state__title">No tienes pedidos aún</h2>
        <p className="empty-state__text">Cuando realices un pedido por WhatsApp, aparecerá aquí</p>
        <Link to="/catalogo" className="btn btn--primary">Ver catálogo</Link>
      </div>
    </div>
  );
}
