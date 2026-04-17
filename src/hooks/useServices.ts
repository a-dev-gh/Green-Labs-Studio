import { useState, useEffect } from 'react';
import { supabase } from '../core/supabase';
import type { Service } from '../lib/types';

interface UseServicesResult {
  items: Service[];
  isLoading: boolean;
  error: string | null;
}

export function useServices(): UseServicesResult {
  const [items, setItems] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      setIsLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setItems([]);
      } else {
        setItems((data as Service[]) || []);
      }
      setIsLoading(false);
    }

    fetchServices();
    return () => { cancelled = true; };
  }, []);

  return { items, isLoading, error };
}
