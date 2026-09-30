import { createContext, useContext, useState, type ReactNode } from "react";

import { api } from "../api/client";

interface AuthContextValue {
  token: string | null;
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
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
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
