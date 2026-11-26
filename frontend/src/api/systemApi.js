import apiClient from './apiClient';

export const systemApi = {
  getInfo: () => apiClient.get('/system/info'),
  getHealth: () => apiClient.get('/system/health'),
};
