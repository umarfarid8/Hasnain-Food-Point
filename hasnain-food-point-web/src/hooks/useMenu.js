import { useState, useEffect } from 'react';
import { fetchMenu } from '../lib/api';

export function useMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Wire up to backend API in Phase 2
  }, []);

  return { menu, loading, error };
}
