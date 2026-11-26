import axios from 'axios';

// VITE_API_BASE_URL wins when set (full URL, e.g. http://localhost:8080/api/v1).
// Otherwise VITE_API_ORIGIN (set by Render) becomes <origin>/api/v1.
const configuredBase = import.meta.env.VITE_API_BASE_URL;
const apiOrigin = import.meta.env.VITE_API_ORIGIN;
const baseURL = configuredBase
  || (apiOrigin ? `${apiOrigin.replace(/\/+$/, '')}/api/v1` : '/api/v1');

const apiClient = axios.create({
  baseURL,
  // Render's free tier sleeps after inactivity; the first request can take ~60s.
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', errorMsg, error.response?.data);
    return Promise.reject(error.response?.data || { message: errorMsg });
  }
);

export default apiClient;
