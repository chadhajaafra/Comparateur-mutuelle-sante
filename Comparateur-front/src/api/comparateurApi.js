import axiosClient from './axiosClient';

const comparateurApi = {
    rechercher: (params) =>
        axiosClient.get('/comparateur/recherche', { params }).then(r => r.data),

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
};

export default comparateurApi;