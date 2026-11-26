import apiClient from './apiClient';

export const assistantApi = {
  ask: (question) => apiClient.get('/assistant/ask', { params: { q: question } }),
};
