"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { authStorage } from "@/lib/auth";
import { api } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  profileId: string | null;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ onboardingDone: boolean }>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializa com null para evitar hydration mismatch (SSR vs client)
  const [token, setToken] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Lê localStorage apenas no cliente após mount
  useEffect(() => {
    setToken(authStorage.getToken());
    setProfileId(authStorage.getProfileId());
    setInitialized(true);
  }, []);

  const _storeSession = (accessToken: string, pid: string) => {
    authStorage.set(accessToken, pid);
    setToken(accessToken);
    setProfileId(pid);
  };

  const register = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ accessToken: string; profileId: string }>(
      "/auth/register",
      { email, password }
    );
    _storeSession(data.accessToken, data.profileId);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ accessToken: string; profileId: string }>(
      "/auth/login",
      { email, password }
    );
    _storeSession(data.accessToken, data.profileId);

    const profile = await api.get<{ onboardingDone: boolean }>("/profiles/me");
    return { onboardingDone: profile.onboardingDone };
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setToken(null);
    setProfileId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        profileId,
        isAuthenticated: !!token,
        initialized,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
