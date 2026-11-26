import apiClient from './apiClient';

export const guideApi = {
  search: (params) => apiClient.get('/guides', { params }),
  getById: (id) => apiClient.get(`/guides/${id}`),
  getRecent: () => apiClient.get('/guides/recent'),
  getByCategorySlug: (slug) => apiClient.get(`/guides/category/${slug}`),
};
