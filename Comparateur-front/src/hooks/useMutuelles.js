import { useState, useEffect } from 'react';
import mutuelleApi from '../api/mutuelleApi';

export function useMutuelles(filters = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filtersKey = Object.entries(filters)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${k}=${v}`)
        .sort()
        .join('&');

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const res = await mutuelleApi.getAll(filters);
                if (!cancelled) setData(res.data);
            } catch (e) {
                if (!cancelled) setError(e.response?.data?.title || 'Erreur de chargement');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
        return () => { cancelled = true; };
    }, [filtersKey]);

    const refetch = () => {
        mutuelleApi.getAll(filters)
            .then(res => setData(res.data))
            .catch(e => setError(e.response?.data?.title || 'Erreur de chargement'));
    };

    return { data, loading, error, refetch };
}

export function useMutuelle(id) {
    const [mutuelle, setMutuelle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const res = await mutuelleApi.getById(id);
                if (!cancelled) setMutuelle(res.data);
            } catch (e) {
                if (!cancelled) setError(e.response?.data?.title || 'Introuvable');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
        return () => { cancelled = true; };
    }, [id]);

    return { mutuelle, loading, error };
}