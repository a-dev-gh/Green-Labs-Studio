import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthProvider';
import { CartProvider } from './core/cart/CartProvider';
import { WishlistProvider } from './core/wishlist/WishlistProvider';
import { AppRouter } from './router';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRouter />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
