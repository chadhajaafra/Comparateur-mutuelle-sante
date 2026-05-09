import { useState, useEffect, useCallback } from 'react';
import garantieApi from '../api/garantieApi';

export function useGaranties() {
    const [garanties, setGaranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await garantieApi.getAll();
                if (!cancelled) setGaranties(res.data);
            } catch (e) {
                if (!cancelled) setError(e.response?.data?.title || 'Erreur de chargement');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { garanties, loading, error, refetch: fetchData };
}