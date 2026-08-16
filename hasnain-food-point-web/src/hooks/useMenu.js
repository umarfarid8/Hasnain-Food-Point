import { useState, useEffect, useCallback } from 'react';
import { fetchMenu } from '../lib/api';
import { DEFAULT_MENU } from '../lib/constants';

export function useMenu() {
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMenu();
      if (Array.isArray(data) && data.length > 0) {
        setMenu(data);
      }
    } catch (err) {
      console.warn('Failed to load menu from API, using fallback menu:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchMenu();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setMenu(data);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Failed to load menu from API on mount, using fallback:', err);
          setError(err);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { menu, loading, error, refetch: loadMenu };
}
