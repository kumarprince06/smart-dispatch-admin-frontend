import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Create an Axios instance configured with our backend prefix
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds (Render Free Tier cold start safe)
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors globally (like 401 Unauthorized)
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If it's a 401, we aren't on the login page, and we haven't already retried this request
    if (error.response?.status === 401 && window.location.pathname !== '/login' && originalRequest && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If already refreshing, queue the request until the refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Attempt to get a new access token
          const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
            refreshToken
          });

          // Extract the new token from the backend ApiResponse wrapper
          const newAccessToken = data?.data?.accessToken;
          const newRefreshToken = data?.data?.refreshToken; // Backend might optionally rotate the refresh token

          if (newAccessToken) {
            localStorage.setItem('auth_token', newAccessToken);
            if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
            
            // Re-apply token to the original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            // Release queued requests
            processQueue(null, newAccessToken);
            
            // Retry the original request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token failed (expired or revoked)
          processQueue(refreshError, null);
        } finally {
          isRefreshing = false;
        }
      }

      // If we fall through here, either no refresh token existed, or the refresh failed
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
