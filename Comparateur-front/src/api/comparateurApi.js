import axiosClient from './axiosClient';

const comparateurApi = {
    rechercher: (params = {}) => {
        const clean = Object.fromEntries(
            Object.entries(params).filter(([, v]) =>
                v !== undefined && v !== null && v !== '' &&
                !(Array.isArray(v) && v.length === 0)
            )
        );
        return axiosClient.get('/comparateur/recherche', { params: clean }).then(r => r.data);
    },
    obtenirSession: () =>
        axiosClient.post('/comparateur/session').then(r => r.data),
    getSession: (sessionId) =>
        axiosClient.get(`/comparateur/session/${sessionId}`).then(r => r.data),
    ajouterOffre: (sessionId, offreId) =>
        axiosClient.post(`/comparateur/session/${sessionId}/offres`, { offreId }).then(r => r.data),
    retirerOffre: (sessionId, offreId) =>
        axiosClient.delete(`/comparateur/session/${sessionId}/offres/${offreId}`),
    viderSession: (sessionId) =>
        axiosClient.delete(`/comparateur/session/${sessionId}`),

    analyserContrat: (fichier) => {
        const formData = new FormData();
        formData.append('fichier', fichier);
        return axiosClient
            .post('/comparateur/analyser-contrat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(r => r.data);
    },
};

export default comparateurApi;