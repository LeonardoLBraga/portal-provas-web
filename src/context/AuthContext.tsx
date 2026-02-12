import { useCallback, useState, type ReactNode } from "react";
import { login as apiLogin } from "../services/api";
import type { User } from "../types/auth";
import { AuthContext } from "./auth-context";

const STORAGE_TOKEN = "portal_provas_token";
const STORAGE_USER = "portal_provas_user";

function loadFromStorage(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN);
    const userJson = localStorage.getItem(STORAGE_USER);
    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      return { token, user };
    }
  } catch {
    // ignore
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState(() => {
    const stored = loadFromStorage();
    return {
      user: stored.user,
      token: stored.token,
      loading: false,
    };
  });

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin({ email, password });
    setAuthState({ user: data.user, token: data.token, loading: false });
    localStorage.setItem(STORAGE_TOKEN, data.token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, token: null, loading: false });
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
  }, []);

  const value = {
    user: authState.user,
    token: authState.token,
    loading: authState.loading,
    isAuthenticated: !!authState.token && !!authState.user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
