import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/useAuth';
import { generateWhatsAppLink } from '../../lib/whatsapp';
import type { CartItem, Product } from '../../lib/types';

interface CartItemWithProduct extends CartItem {
  product: Product;
}

interface CartContextValue {
  items: CartItemWithProduct[];
  itemCount: number;
  total: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getWhatsAppLink: (notes?: string) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id);
    setItems((data as CartItemWithProduct[]) || []);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId: string, quantity = 1) => {
    if (!user) return;
    await supabase
      .from('cart_items')
      .upsert(
        { user_id: user.id, product_id: productId, quantity },
        { onConflict: 'user_id,product_id' }
      );
    await fetchCart();
  };

  const removeItem = async (productId: string) => {
    if (!user) return;
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    await fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || quantity < 1) return;
    await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const getWhatsAppLink = (notes?: string) => generateWhatsAppLink(items, total, notes);

  return (
    <CartContext.Provider value={{ items, itemCount, total, isLoading, addItem, removeItem, updateQuantity, clearCart, getWhatsAppLink }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
