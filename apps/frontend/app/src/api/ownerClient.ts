import axios from "axios";

import { redirectToLogin } from "./sessionExpired";

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

// Seconds-since-epoch expiry from a JWT, or null if it can't be read.
function tokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const exp = JSON.parse(atob(payload)).exp;
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
}

const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"] as const;
const CHECK_EVERY_MS = 30_000;
// Renew at most this often, so steady activity doesn't send a request on every check.
const RENEW_AFTER_MS = 5 * 60_000;

// Keeps the owner signed in while they use the dashboard and signs them out after a full token
// lifetime (OWNER_TOKEN_EXPIRE_MINUTES on the server, 60 by default) with no activity. While the
// owner is active the token is swapped for a fresh one every few minutes, so it always outlives
// the idle limit. Returns a function that stops watching.
export function startOwnerSessionKeepAlive(): () => void {
  let lastActivity = Date.now();
  let lastRenewal = 0;
  let idleLimitMs = Infinity; // set from the first fresh token's lifetime
  let renewing = false;

  const markActive = () => {
    lastActivity = Date.now();
  };

  async function renew() {
    renewing = true;
    try {
      const startedAt = Date.now();
      const { data } = await ownerApi.post<{ access_token: string }>("/owner/auth/refresh");
      if (!getOwnerToken()) return; // signed out while the request was in flight
      setOwnerToken(data.access_token);
      lastRenewal = startedAt;
      const exp = tokenExpiry(data.access_token);
      if (exp) idleLimitMs = exp * 1000 - startedAt;
    } catch {
      // A 401 is handled by the response interceptor; anything else is retried on the next check.
    } finally {
      renewing = false;
    }
  }

  function check() {
    if (!getOwnerToken()) return;
    const now = Date.now();
    if (now - lastActivity >= idleLimitMs) {
      setOwnerToken(null);
      redirectToLogin("/owner/login");
      return;
    }
    if (!renewing && lastActivity > lastRenewal && now - lastRenewal >= RENEW_AFTER_MS) {
      void renew();
    }
  }

  ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, markActive, { capture: true, passive: true }));
  // Timers are slowed down in background tabs, so check again as soon as the tab is shown.
  document.addEventListener("visibilitychange", check);
  const timer = window.setInterval(check, CHECK_EVERY_MS);
  // Opening (or reloading) the dashboard counts as activity: renew straight away so the idle limit
  // is measured from a fresh token rather than whatever is left of an older one.
  void renew();

  return () => {
    ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, markActive, { capture: true }));
    document.removeEventListener("visibilitychange", check);
    window.clearInterval(timer);
  };
}

// An expired or invalid owner token ends the session.
ownerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getOwnerToken()) {
      setOwnerToken(null);
      redirectToLogin("/owner/login");
    }
    return Promise.reject(error);
  },
);
