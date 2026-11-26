import apiClient from './apiClient';

export const commandApi = {
  search: (params) => apiClient.get('/commands', { params }),
  getByCategorySlug: (slug) => apiClient.get(`/commands/category/${slug}`),
  getFeatured: () => apiClient.get('/commands/featured'),
  getRecent: () => apiClient.get('/commands/recent'),
  getById: (id) => apiClient.get(`/commands/${id}`),
  create: (data) => apiClient.post('/commands', data),
  update: (id, data) => apiClient.put(`/commands/${id}`, data),
  delete: (id) => apiClient.delete(`/commands/${id}`),
  recordUsage: (id, context) => apiClient.post(`/commands/${id}/copy`, null, { params: { context } }),
};
