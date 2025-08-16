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

// API endpoints for CyberShield incident management
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    adminLogin: '/auth/admin/login',
    logout: '/auth/logout',
  },
  incidents: {
    list: '/incidents',
    get: (id: string) => `/incidents/${id}`,
    create: '/incidents',
    update: (id: string) => `/incidents/${id}`,
    delete: (id: string) => `/incidents/${id}`,
    escalate: (id: string) => `/incidents/${id}/escalate`,
  },
  admin: {
    incidents: {
      list: '/admin/incidents',
      get: (id: string) => `/admin/incidents/${id}`,
      updateStatus: (id: string) => `/admin/incidents/${id}/status`,
      forwardToLE: (id: string) => `/admin/incidents/${id}/forward-le`,
      assign: (id: string) => `/admin/incidents/${id}/assign`,
    },
    lawEnforcement: {
      list: '/admin/law-enforcement',
      updateStatus: (id: string) => `/admin/law-enforcement/${id}/status`,
      contact: '/admin/law-enforcement/contact',
    },
    analytics: {
      dashboard: '/admin/analytics/dashboard',
      reports: '/admin/analytics/reports',
    },
  },
  users: {
    list: '/users',
    get: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    update: (id: string) => `/users/${id}`,
  },
};

// CyberShield API service functions
export const cyberShieldApi = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) => 
      post(apiEndpoints.auth.login, credentials),
    register: (userData: { name: string; email: string; password: string }) => 
      post(apiEndpoints.auth.register, userData),
    adminLogin: (credentials: { email: string; password: string; badgeNumber: string }) => 
      post(apiEndpoints.auth.adminLogin, credentials),
    logout: () => post(apiEndpoints.auth.logout),
  },

  // Incidents (User)
  incidents: {
    list: () => get(apiEndpoints.incidents.list),
    get: (id: string) => get(apiEndpoints.incidents.get(id)),
    create: (incidentData: any) => post(apiEndpoints.incidents.create, incidentData),
    update: (id: string, incidentData: any) => put(apiEndpoints.incidents.update(id), incidentData),
    escalate: (id: string) => post(apiEndpoints.incidents.escalate(id)),
  },

  // Admin functions
  admin: {
    incidents: {
      list: () => get(apiEndpoints.admin.incidents.list),
      get: (id: string) => get(apiEndpoints.admin.incidents.get(id)),
      updateStatus: (id: string, status: string, adminNotes?: string) => 
        put(apiEndpoints.admin.incidents.updateStatus(id), { status, adminNotes }),
      forwardToLE: (id: string, lawEnforcementRef: string) => 
        post(apiEndpoints.admin.incidents.forwardToLE(id), { lawEnforcementRef }),
      assign: (id: string, adminId: string) => 
        put(apiEndpoints.admin.incidents.assign(id), { adminId }),
    },
    lawEnforcement: {
      list: () => get(apiEndpoints.admin.lawEnforcement.list),
      updateStatus: (id: string, status: string) => 
        put(apiEndpoints.admin.lawEnforcement.updateStatus(id), { status }),
      contact: (contactInfo: any) => post(apiEndpoints.admin.lawEnforcement.contact, contactInfo),
    },
    analytics: {
      dashboard: () => get(apiEndpoints.admin.analytics.dashboard),
      reports: (dateRange?: { startDate: string; endDate: string }) => 
        get(apiEndpoints.admin.analytics.reports + (dateRange ? `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}` : '')),
    },
  },

  // Users
  users: {
    getProfile: () => get(apiEndpoints.users.profile),
    updateProfile: (userData: any) => put(apiEndpoints.users.profile, userData),
    list: () => get(apiEndpoints.users.list),
    get: (id: string) => get(apiEndpoints.users.get(id)),
  },
};

// Export the main API service
export const apiService = cyberShieldApi;
