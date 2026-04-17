import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../core/supabase';
import { fuzzyMatch } from '../lib/fuzzyMatch';
import type { Product } from '../lib/types';

interface UseProductsResult {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Product[];
}

export function useProducts(): UseProductsResult {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setItems([]);
      } else {
        setItems((data as Product[]) || []);
      }
      setIsLoading(false);
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  const search = useCallback(
    (query: string): Product[] => {
      if (!query.trim()) return items;
      return items.filter(
        p =>
          fuzzyMatch(query, p.name) ||
          (p.description && fuzzyMatch(query, p.description)) ||
          (p.category?.name && fuzzyMatch(query, p.category.name))
      );
    },
    [items]
  );

  return { items, isLoading, error, search };
}
