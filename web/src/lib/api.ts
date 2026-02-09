import axios from 'axios';

// Create a configured axios instance
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to set the auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 or other global errors here if needed
    if (error.response?.status === 401) {
      // Potentially redirect to login or clear session
      console.warn('Unauthorized access');
    }
    return Promise.reject(error);
  }
);
