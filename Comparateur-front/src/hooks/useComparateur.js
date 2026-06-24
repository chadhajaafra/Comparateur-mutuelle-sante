import { useState, useCallback, useEffect } from 'react';
import comparateurApi from '../api/comparateurApi';

const SESSION_KEY = 'comp_session_id';

export function useComparateur() {
    const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_KEY));
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initSession = useCallback(async () => {
        setLoading(true);
        try {
            const s = await comparateurApi.obtenirSession();
            localStorage.setItem(SESSION_KEY, s.id);
            setSessionId(s.id);
            return s.id;
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const chargerSession = useCallback(async (id) => {
        if (!id) return;
        try {
            const s = await comparateurApi.getSession(id);
            setSession(s);
        } catch {
            // session expirée → en recréer une
            localStorage.removeItem(SESSION_KEY);
            setSessionId(null);
            setSession(null);
        }
    }, []);

    useEffect(() => {
        if (sessionId) chargerSession(sessionId);
    }, [sessionId, chargerSession]);

    const ajouterOffre = useCallback(async (offreId) => {
        let sid = sessionId;
        if (!sid) sid = await initSession();
        if (!sid) return;
        const updated = await comparateurApi.ajouterOffre(sid, offreId);
        setSession(updated);
    }, [sessionId, initSession]);

    const retirerOffre = useCallback(async (offreId) => {
        if (!sessionId) return;
        await comparateurApi.retirerOffre(sessionId, offreId);
        await chargerSession(sessionId);
    }, [sessionId, chargerSession]);

    const viderSession = useCallback(async () => {
        if (!sessionId) return;
        await comparateurApi.viderSession(sessionId);
        setSession(null);
    }, [sessionId]);

    const isInSession = useCallback((offreId) =>
        session?.offres?.some(o => o.id === offreId) ?? false,
        [session]);

    return {
        session, sessionId, loading, error,
        ajouterOffre, retirerOffre, viderSession, isInSession,
        nbOffres: session?.offres?.length ?? 0,
    };
}