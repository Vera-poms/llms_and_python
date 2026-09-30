import axios from "axios";

// Owner tokens live in sessionStorage (cleared when the tab closes) and use their own client,
// so they are never sent with student requests and student tokens are never sent as owner ones.
const OWNER_TOKEN_KEY = "owner_token";

export const ownerApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function getOwnerToken(): string | null {
  return sessionStorage.getItem(OWNER_TOKEN_KEY);
}

export function setOwnerToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(OWNER_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(OWNER_TOKEN_KEY);
  }
}

ownerApi.interceptors.request.use((config) => {
  const token = getOwnerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired or invalid owner token ends the session.
ownerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getOwnerToken()) {
      setOwnerToken(null);
      window.location.replace("/owner/login");
    }
    return Promise.reject(error);
  },
);
