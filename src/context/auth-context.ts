import { createContext } from "react";

export interface AuthContextValue {
  user: { id: number; name: string; email: string; role: string } | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
