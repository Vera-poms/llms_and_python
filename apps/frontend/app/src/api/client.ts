import axios from "axios";

import { redirectToLogin } from "./sessionExpired";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A stored token the backend rejects (expired, or signed with an old SECRET_KEY) would leave the
// app looking logged in while every request fails. Drop it and send the user back to log in.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = String(error.config?.url ?? "").startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthCall && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("last-activity");
      redirectToLogin("/login");
    }
    return Promise.reject(error);
  },
);
