import axios from "axios";

// Admin tokens live in sessionStorage (cleared when the tab closes) and use their own client,
// so they are never sent with student or owner requests and vice versa.
const ADMIN_TOKEN_KEY = "admin_token";

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired or invalid admin token (or revoked admin access) ends the session.
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if ((status === 401 || status === 403) && getAdminToken()) {
      setAdminToken(null);
      window.location.replace("/admin/login");
    }
    return Promise.reject(error);
  },
);
