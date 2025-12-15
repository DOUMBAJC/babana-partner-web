import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { translations, type Language } from "~/lib/translations";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  error?: any;
}



const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:8000/api",
  timeout: parseInt(import.meta.env.VITE_APP_API_TIMEOUT || "30000", 10),
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": import.meta.env.VITE_APP_API_KEY,
  },
});

let currentLanguage = "fr";

export const setApiLanguage = (language: "fr" | "en") => {
  currentLanguage = language;
};

export const getApiLanguage = () => currentLanguage;
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Accept-Language"] = currentLanguage;

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("babana-auth-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const apiKey = import.meta.env.VITE_APP_API_KEY;
    if (apiKey) {
      config.headers["X-API-Key"] = apiKey;
    }

    if (import.meta.env.VITE_APP_MODE === 'development') {
      console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_MODE === 'development') {
      console.log("📥 API Response:", response.status, response.config.url);
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: "Une erreur est survenue",
      status: error.response?.status,
    };

    if (error.response) {
      const data = error.response.data as any;
      apiError.message = data?.error?.message || data?.message || data?.error || translations[currentLanguage as Language].common.serverError;
      apiError.code = data?.code;
      apiError.details = data?.details;
      console.log('Error message : ', data?.error?.message);
      
      const common = translations[currentLanguage as Language].common;

      switch (error.response.status) {
        case 401:
          if (typeof window !== "undefined") {
            localStorage.removeItem("babana-auth-token");
          }
          apiError.message = data?.message || common.sessionExpired;
          break;
        case 403:
          apiError.message = data?.message || common.accessDenied;
          break;
        case 404:
          apiError.message = data?.message || common.resourceNotFound;
          break;
        case 422:
          apiError.message = data?.error?.message || common.invalidData;
          break;
        case 429:
          apiError.message = data?.message || common.tooManyRequests;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          apiError.message = data?.message || common.serverError;
          break;
      }
    } else if (error.request) {
      apiError.message = translations[currentLanguage as Language].common.unableToContactServer;
      apiError.code = "NETWORK_ERROR";
    } else {
      apiError.message = error.message || translations[currentLanguage as Language].common.errorPreparingRequest;
    }

    if (import.meta.env.VITE_MODE === 'development') {
      console.error("❌ API Error:", error.config?.url, apiError.status, apiError.message);
    }

    return Promise.reject(apiError);
  }
);

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions extends Omit<AxiosRequestConfig, "method" | "url"> {
  showLoader?: boolean;
  requiresAuth?: boolean;
}

export const api = {
  get: <T = any>(url: string, config?: RequestOptions) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: RequestOptions) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: RequestOptions) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: RequestOptions) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: RequestOptions) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

export default axiosInstance;