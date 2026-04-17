import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/useAuth';
import { generateWhatsAppLink } from '../../lib/whatsapp';
import type { CartItem, Product } from '../../lib/types';
import { getSessionId, getOrCreateSessionId, clearSessionId } from './sessionId';

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

  // Track the previous user id so we can detect the null → id transition for merge.
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);

    if (user) {
      // Authenticated path — direct table query filtered by user_id.
      const { data } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', user.id);
      setItems((data as CartItemWithProduct[]) || []);
    } else {
      // Guest path — only fetch if a session id already exists in storage.
      const sessionId = getSessionId();
      if (!sessionId) {
        setItems([]);
      } else {
        const { data } = await supabase.rpc('guest_cart_list', {
          p_session_id: sessionId,
        });
        // The RPC returns rows with a `product` jsonb column already populated.
        setItems((data as CartItemWithProduct[]) || []);
      }
    }

    setIsLoading(false);
  }, [user]);

  // Fetch cart whenever the user identity changes.
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Merge-on-login: detect null → <id> transition.
  useEffect(() => {
    const prevId = prevUserIdRef.current;

    // On first render prevId is `undefined` — skip merge but record current value.
    if (prevId !== undefined && prevId === null && user !== null) {
      // User just logged in. Merge any existing guest session.
      const sessionId = getSessionId();
      if (sessionId) {
        supabase
          .rpc('merge_guest_cart', { p_session_id: sessionId })
          .then(() => {
            clearSessionId();
            fetchCart();
          });
      }
    }

    prevUserIdRef.current = user?.id ?? null;
  }, [user, fetchCart]);

  // ---- Mutations -----------------------------------------------------------

  const addItem = async (productId: string, quantity = 1) => {
    if (user) {
      await supabase
        .from('cart_items')
        .upsert(
          { user_id: user.id, product_id: productId, quantity },
          { onConflict: 'user_id,product_id' }
        );
    } else {
      const sessionId = getOrCreateSessionId();
      await supabase.rpc('guest_cart_add', {
        p_session_id: sessionId,
        p_product_id: productId,
        p_quantity: quantity,
      });
    }
    await fetchCart();
  };

  const removeItem = async (productId: string) => {
    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } else {
      const sessionId = getOrCreateSessionId();
      await supabase.rpc('guest_cart_remove', {
        p_session_id: sessionId,
        p_product_id: productId,
      });
    }
    await fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    if (user) {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } else {
      const sessionId = getOrCreateSessionId();
      await supabase.rpc('guest_cart_update_quantity', {
        p_session_id: sessionId,
        p_product_id: productId,
        p_quantity: quantity,
      });
    }
    await fetchCart();
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    } else {
      const sessionId = getOrCreateSessionId();
      await supabase.rpc('guest_cart_clear', { p_session_id: sessionId });
    }
    setItems([]);
  };

  // ---- Derived values ------------------------------------------------------

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const getWhatsAppLink = (notes?: string) => generateWhatsAppLink(items, total, notes);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getWhatsAppLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
