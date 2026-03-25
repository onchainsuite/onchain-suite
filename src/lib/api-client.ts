import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { authClient } from "@/lib/auth-client";

export const API_BASE_URL = "/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - no longer needs to call getSession on every request
// which was causing 429 Too Many Requests errors.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle specific status codes
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      const message = data?.error?.message || data?.message || error.message;

      console.error(`API Error [${status}]:`, message);

      if (status === 401) {
        // Handle unauthorized (e.g., redirect to login if not already there)
        // Only if we are in the browser
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          // window.location.href = "/auth/signin";
        }
      }
    } else if (error.request) {
      console.error("API Error: No response received from server");
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);
