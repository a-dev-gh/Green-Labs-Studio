import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/useAuth';
import type { Wishlist, WishlistItem, Product } from '../../lib/types';

interface WishlistWithItems extends Wishlist {
  items: (WishlistItem & { product: Product })[];
}

interface WishlistContextValue {
  wishlists: WishlistWithItems[];
  isLoading: boolean;
  createWishlist: (name: string) => Promise<void>;
  deleteWishlist: (wishlistId: string) => Promise<void>;
  addItem: (wishlistId: string, productId: string) => Promise<void>;
  removeItem: (wishlistId: string, productId: string) => Promise<void>;
  isInAnyWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<WishlistWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlists = useCallback(async () => {
    if (!user) {
      setWishlists([]);
      return;
    }
    setIsLoading(true);
    const { data } = await supabase
      .from('wishlists')
      .select('*, items:wishlist_items(*, product:products(*))')
      .eq('user_id', user.id);
    setWishlists((data as WishlistWithItems[]) || []);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const createWishlist = async (name: string) => {
    if (!user) return;
    await supabase.from('wishlists').insert({ user_id: user.id, name });
    await fetchWishlists();
  };

  const deleteWishlist = async (wishlistId: string) => {
    if (!user) return;
    await supabase.from('wishlists').delete().eq('id', wishlistId);
    await fetchWishlists();
  };

  const addItem = async (wishlistId: string, productId: string) => {
    await supabase
      .from('wishlist_items')
      .upsert(
        { wishlist_id: wishlistId, product_id: productId },
        { onConflict: 'wishlist_id,product_id' }
      );
    await fetchWishlists();
  };

  const removeItem = async (wishlistId: string, productId: string) => {
    await supabase
      .from('wishlist_items')
      .delete()
      .eq('wishlist_id', wishlistId)
      .eq('product_id', productId);
    await fetchWishlists();
  };

  const isInAnyWishlist = (productId: string) => {
    return wishlists.some(wl => wl.items.some(item => item.product_id === productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlists, isLoading, createWishlist, deleteWishlist, addItem, removeItem, isInAnyWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
