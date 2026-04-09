import { Link } from 'react-router-dom';
import { useCart } from '../core/cart/CartProvider';
import '../styles/pages/cart.css';
import '../styles/components/button.css';

export default function Cart() {
  const { items, itemCount, total, removeItem, updateQuantity, getWhatsAppLink } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart">
        <h1 className="cart__title">Tu Carrito</h1>
        <div className="cart__empty">
          <div className="cart__empty-icon">🛒</div>
          <h2 className="cart__empty-title">Tu carrito está vacío</h2>
          <p className="cart__empty-text">Agrega suculentas de nuestro catálogo para empezar</p>
          <Link to="/catalogo" className="btn btn--primary btn--lg">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1 className="cart__title">Tu Carrito ({itemCount})</h1>
      <div className="cart__list">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item__image" />
            <div className="cart-item__info">
              <h3 className="cart-item__name">{item.product?.name || 'Producto'}</h3>
              <p className="cart-item__price">RD$ {(item.product?.price || 0).toFixed(2)}</p>
            </div>
            <div className="cart-item__qty">
              <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
              <span className="cart-item__qty-num">{item.quantity}</span>
              <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
            </div>
            <button className="cart-item__remove" onClick={() => removeItem(item.product_id)}>Eliminar</button>
          </div>
        ))}
      </div>
      <div className="cart__summary">
        <div className="cart__total">
          <span>Total</span>
          <span className="cart__total-price">RD$ {total.toFixed(2)}</span>
        </div>
        <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--full btn--lg">
          Ordenar por WhatsApp
        </a>
      </div>
    </div>
  );
}
