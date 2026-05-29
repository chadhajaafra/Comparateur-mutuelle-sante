import axiosClient from './axiosClient';

const mutuelleApi = {
    getAll: (params) => axiosClient.get('/mutuelles', { params }),
    getById: (id) => axiosClient.get(`/mutuelles/${id}`),
    create: (data) => axiosClient.post('/mutuelles', data),
    update: (id, data) => axiosClient.put(`/mutuelles/${id}`, data),
    delete: (id) => axiosClient.delete(`/mutuelles/${id}`),
    addOffre: (mutuelleId, data) => {
        console.log('addOffre payload:', data);   
        return axiosClient.post(`/mutuelles/${mutuelleId}/offres`, data);
    },
    addGarantie: (offreId, data) => axiosClient.post(`/mutuelles/offres/${offreId}/garanties`, data),
};

export default mutuelleApi;