import { useState, useEffect } from 'react';
import { supabase } from '../core/supabase';
import type { Product } from '../lib/types';

interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

export function useProduct(slug: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (cancelled) return;

      if (err) {
        setError(err.code === 'PGRST116' ? 'Producto no encontrado' : err.message);
        setProduct(null);
      } else {
        setProduct(data as Product);
      }
      setIsLoading(false);
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [slug]);

  return { product, isLoading, error };
}
