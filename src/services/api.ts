/**
 * API service for handling HTTP requests
 */

// Base configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';
const API_TIMEOUT = 10000; // 10 seconds

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// HTTP Methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request configuration
interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * Base API request function
 */
const makeRequest = async <T = any>(
  endpoint: string,
  config: RequestConfig
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const timeout = config.timeout || API_TIMEOUT;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const headers = {
    ...defaultHeaders,
    ...config.headers,
  };

  const requestConfig: RequestInit = {
    method: config.method,
    headers,
  };

  if (config.body && config.method !== 'GET') {
    requestConfig.body = JSON.stringify(config.body);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...requestConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        message: responseData.message || 'Request failed',
        status: response.status,
        data: responseData,
      } as ApiError;
    }

    return {
      data: responseData,
      success: true,
      message: 'Request successful',
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw {
        message: 'Request timeout',
        status: 408,
      } as ApiError;
    }

    if (error.status) {
      throw error as ApiError;
    }

    throw {
      message: error.message || 'Network error',
      status: 0,
    } as ApiError;
  }
};

/**
 * GET request
 */
export const get = <T = any>(
  endpoint: string,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
  return makeRequest<T>(endpoint, { method: 'GET', headers });
};

/**
 * POST request
 */
export const post = <T = any>(
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
  return makeRequest<T>(endpoint, { method: 'POST', body, headers });
};

/**
 * PUT request
 */
export const put = <T = any>(
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
  return makeRequest<T>(endpoint, { method: 'PUT', body, headers });
};

/**
 * DELETE request
 */
export const del = <T = any>(
  endpoint: string,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
  return makeRequest<T>(endpoint, { method: 'DELETE', headers });
};

/**
 * PATCH request
 */
export const patch = <T = any>(
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
  return makeRequest<T>(endpoint, { method: 'PATCH', body, headers });
};

// Example API endpoints - Replace with your actual API endpoints
export const apiEndpoints = {
  users: {
    list: '/users',
    get: (id: number) => `/users/${id}`,
    create: '/users',
    update: (id: number) => `/users/${id}`,
    delete: (id: number) => `/users/${id}`,
  },
  posts: {
    list: '/posts',
    get: (id: number) => `/posts/${id}`,
    create: '/posts',
    update: (id: number) => `/posts/${id}`,
    delete: (id: number) => `/posts/${id}`,
  },
};

// Example usage functions
export const apiService = {
  // User related API calls
  getUsers: () => get(apiEndpoints.users.list),
  getUser: (id: number) => get(apiEndpoints.users.get(id)),
  createUser: (userData: any) => post(apiEndpoints.users.create, userData),
  updateUser: (id: number, userData: any) => put(apiEndpoints.users.update(id), userData),
  deleteUser: (id: number) => del(apiEndpoints.users.delete(id)),

  // Post related API calls
  getPosts: () => get(apiEndpoints.posts.list),
  getPost: (id: number) => get(apiEndpoints.posts.get(id)),
  createPost: (postData: any) => post(apiEndpoints.posts.create, postData),
  updatePost: (id: number, postData: any) => put(apiEndpoints.posts.update(id), postData),
  deletePost: (id: number) => del(apiEndpoints.posts.delete(id)),
};
