import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { authClient } from "@/lib/auth-client";

export const API_BASE_URL = typeof window !== "undefined" ? "/api/v1" : "https://onchain-backend-dvxw.onrender.com/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await authClient.getSession();
      // Better-auth usually handles tokens via cookies, but if we need a bearer token:
      // We might need to extract it if better-auth exposes it in the session object.
      // Assuming better-auth uses cookies for same-site (or correctly configured CORS).
      // If we need to send a token manually, we'd do it here.

      // However, since we are using an external domain, we rely on better-auth to handle the token.
      // If the backend is configured to accept the session cookie from the frontend, we need:
      config.withCredentials = true;
    } catch (error) {
      // Session fetching failed
    }
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
    // Handle 401s, etc.
    return Promise.reject(error);
  }
);
