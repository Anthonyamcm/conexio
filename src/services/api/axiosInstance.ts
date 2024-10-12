import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { Alert } from 'react-native';
import {
  clearAllTokens,
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
} from '../../utils/SecureStore'; // Import helper functions

// Define the shape of your error response
interface ErrorResponse {
  message: string;
  [key: string]: any;
}

// Define the shape of the refresh token response
interface RefreshTokenResponse {
  token: string;
}

// Define the shape of the refresh token request
interface RefreshTokenRequest {
  token: string;
}

// Extend AxiosRequestConfig to include a custom retry property
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

// Define the structure of each failed request in the queue
interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // Ensure this is set in your .env files
  timeout: 10000, // 10 seconds timeout
});

// Flag to indicate if token is being refreshed
let isRefreshing = false;

// Initialize the failedQueue array
let failedQueue: FailedRequest[] = [];

/**
 * Processes the failed requests queue.
 * @param error - The error to reject the promises with, if any.
 * @param token - The token to resolve the promises with, if no error.
 */
const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  // Clear the queue
  failedQueue = [];
};

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Skip the interceptor if the custom header is set
    if (config.headers?.['skipAuthInterceptor']) {
      delete config.headers['skipAuthInterceptor'];
      return config;
    }

    try {
      const token = await getAuthToken();
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        } else if (!(config.headers instanceof AxiosHeaders)) {
          config.headers = new AxiosHeaders(config.headers);
        }

        // Set the Authorization header in a type-safe manner
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('Error fetching auth token:', error);
    }
    return config;
  },
  (error: AxiosError): Promise<never> => Promise.reject(error),
);

// Response interceptor to handle errors and token refreshing
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<ErrorResponse>): Promise<any> => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    // Prevent infinite loops by checking if the request has already been retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/confirm')
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If token is already being refreshed, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Make a request to refresh the token using the default axios instance to avoid interceptors
        const response = await axios.post<RefreshTokenResponse>(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          { token: refreshToken } as RefreshTokenRequest,
        );

        const newToken = response.data.token;

        // Update the auth token in storage
        await setAuthToken(newToken);

        // Update the default Authorization header
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        await clearAllTokens();

        Alert.alert('Authentication Error', 'Please log in again.');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error statuses
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 403:
          Alert.alert(
            'Access Denied',
            data.message || 'You do not have access.',
          );
          break;
        case 500:
          Alert.alert('Server Error', 'Something went wrong on our end.');
          break;
        default:
          Alert.alert('Error', data.message || 'An error occurred.');
      }
    } else if (error.request) {
      console.log(error.request);
      Alert.alert('Network Error', 'Please check your internet connection.');
    } else {
      Alert.alert('Error', error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
