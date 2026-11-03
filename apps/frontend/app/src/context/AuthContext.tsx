import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { api } from "../api/client";

const LAST_ACTIVITY_KEY = "last-activity";
const IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 30 * 1000;
const ACTIVITY_WRITE_INTERVAL_MS = 10 * 1000;

// Reads the user id ("sub" claim) from the JWT. Not verified here; only used to namespace client-side storage.
function userIdFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const sub = JSON.parse(atob(payload)).sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null;
  }
}

function clearDrafts(): void {
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith("practice-cell:"))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // ignore
  }
}

interface AuthContextValue {
  token: string | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  async function authenticate(path: "login" | "signup", email: string, password: string) {
    const response = await api.post<{ access_token: string }>(`/auth/${path}`, { email, password });
    localStorage.setItem("token", response.data.access_token);
    setToken(response.data.access_token);
  }

  async function resetPassword(resetToken: string, newPassword: string) {
    const response = await api.post<{ access_token: string }>("/auth/reset-password", {
      token: resetToken,
      new_password: newPassword,
    });
    localStorage.setItem("token", response.data.access_token);
    setToken(response.data.access_token);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    clearDrafts();
    setToken(null);
  }

  // Expiring only drops the token; unlike logout(), it keeps drafts so work is there after logging back in.
  function expireSession() {
    localStorage.removeItem("token");
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setToken(null);
  }

  // Expire the session after an hour without activity. The last-activity time lives in localStorage so it
  // also covers closed tabs and other open tabs.
  useEffect(() => {
    if (!token) return;

    function lastActivity(): number {
      return Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || Date.now();
    }

    function checkIdle() {
      if (Date.now() - lastActivity() >= IDLE_TIMEOUT_MS) expireSession();
    }

    function recordActivity() {
      const now = Date.now();
      if (now - lastActivity() > ACTIVITY_WRITE_INTERVAL_MS) {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
      }
    }

    if (localStorage.getItem(LAST_ACTIVITY_KEY) === null) {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    }
    checkIdle();

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((name) => window.addEventListener(name, recordActivity, { passive: true }));
    const timer = window.setInterval(checkIdle, CHECK_INTERVAL_MS);
    return () => {
      events.forEach((name) => window.removeEventListener(name, recordActivity));
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        userId: userIdFromToken(token),
        login: (email, password) => authenticate("login", email, password),
        signup: (email, password) => authenticate("signup", email, password),
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
