import { useState, useEffect } from 'react';
import garantieApi from '../api/garantieApi';

export function useGaranties() {
    const [garanties, setGaranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
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

        fetchData();
        return () => { cancelled = true; };
    }, []);

    return { garanties, loading, error };
}