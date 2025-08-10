import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import useAuthStore from '~/store/useAuth';

// Types and Interfaces
// Auth specific response interface
export interface AuthResponse {
  user: any;
  jwt: string;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retry?: boolean;
}

// Extended config for internal use
interface InternalRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retry?: boolean;
}

// Base API Service Class
export class ApiService {
  private instance: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'https://api.example.com') {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_TOKEN}`,
      },
    });

    this.setupInterceptors();
    this.loadToken();
  }

  // Setup request and response interceptors
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        const customConfig = config as InternalRequestConfig;
        if (!customConfig.skipAuth && this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },

      async (error) => {
        console.error('❌ Response Error:', error.response?.status, error.message);
        console.log({ error });
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          await AsyncStorage.clear();
          useAuthStore.getState().logout();
          router.push('/login');
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          console.error('Access forbidden');
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  // Load token from AsyncStorage
  private async loadToken(): Promise<void> {
    try {
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  // Set auth token
  public async setToken(token: string): Promise<void> {
    this.token = token;
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  // Clear auth token
  public async clearToken(): Promise<void> {
    this.token = null;
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  // Handle unauthorized access
  private async handleUnauthorized(): Promise<void> {
    await this.clearToken();
    // You can add navigation logic here to redirect to login
    console.log('User unauthorized, redirecting to login...');
  }

  // Format error response
  private formatError(error: any): ApiError {
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    };
  }

  // Generic GET request
  public async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.instance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic POST request
  public async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PUT request
  public async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.instance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PATCH request
  public async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.instance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic DELETE request
  public async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.instance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload file
  public async uploadFile<T = any>(
    url: string,
    file: any,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.instance.post<T>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Download file
  public async downloadFile(url: string, config?: RequestConfig): Promise<Blob> {
    try {
      const response = await this.instance.get(url, {
        ...config,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Retry mechanism
  public async retryRequest<T = any>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    throw lastError;
  }
}

export class PoseService extends ApiService {
  constructor() {
    super('https://api.example.com/poses');
  }

  async getPoses(params?: any) {
    return this.get('', { params });
  }

  async getPoseById(id: string) {
    return this.get(`/${id}`);
  }

  async createPose(poseData: any) {
    return this.post('', poseData);
  }

  async updatePose(id: string, poseData: any) {
    return this.put(`/${id}`, poseData);
  }

  async deletePose(id: string) {
    return this.delete(`/${id}`);
  }

  async uploadPoseImage(id: string, file: any) {
    return this.uploadFile(`/${id}/image`, file);
  }
}

export const poseService = new PoseService();

// Default export
export default ApiService;
