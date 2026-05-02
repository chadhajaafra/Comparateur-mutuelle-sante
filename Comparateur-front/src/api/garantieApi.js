import axiosClient from './axiosClient';

const garantieApi = {
    getAll: () => axiosClient.get('/garanties'),
    getById: (id) => axiosClient.get(`/garanties/${id}`),
    create: (data) => axiosClient.post('/garanties', data),
    update: (id, data) => axiosClient.put(`/garanties/${id}`, data),

    // Ajouter une garantie à une offre
    addToOffre: (offreId, data) =>
        axiosClient.post(`/mutuelles/offres/${offreId}/garanties`, data),
};

export default garantieApi;