import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/client';
import { useDebounce } from './useDebounce';

export function useList(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ field: '', order: 'asc' });

  const debouncedFilters = useDebounce(filters, 300);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      Object.entries(debouncedFilters).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });

      if (sort.field) {
        params.append('sortBy', sort.field);
        params.append('order', sort.order);
      }

      const queryString = params.toString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const res = await apiFetch(url);

      // Determine what key to use based on endpoint
      const key = endpoint === '/users' ? 'users' : endpoint === '/stores' ? 'stores' : 'data';
      setData(res[key] || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch list');
    } finally {
      setLoading(false);
    }
  }, [endpoint, debouncedFilters, sort]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    setData,
    setLoading,
    setError,
    refetch: fetchList,
  };
}
