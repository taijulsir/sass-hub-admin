import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}

export function useFetchData<T>(
  fetchFn: (params: any) => Promise<any>,
  params: FetchParams,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Stable ref so we never add fetchFn to deps (avoids re-render loops)
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => { fetchFnRef.current = fetchFn; }, [fetchFn]);

  // Serialize params so the effect only re-runs when values actually change
  const paramsKey = JSON.stringify(params);

  const fetchData = useCallback(async (currentParams: FetchParams) => {
    try {
      setLoading(true);
      const response = await fetchFnRef.current(currentParams);

      const results = response?.data?.data || response?.data || response || [];
      const meta = response?.data?.data
        ? response.data
        : (response?.data || response?.meta || {});

      setData(Array.isArray(results) ? results : []);
      setTotalItems(meta.total ?? 0);
      setTotalPages(meta.totalPages ?? 1);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []); // no deps – uses ref for fetchFn, receives params as argument

  // Single effect: runs when params or manual refresh key changes
  useEffect(() => {
    fetchData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, ...dependencies]);

  return {
    data,
    loading,
    totalItems,
    totalPages,
    refresh: () => fetchData(params),
  };
}
