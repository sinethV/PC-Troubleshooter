import apiClient from './apiClient';

export const dashboardApi = {
  getSummary: () => apiClient.get('/dashboard/summary'),
};
