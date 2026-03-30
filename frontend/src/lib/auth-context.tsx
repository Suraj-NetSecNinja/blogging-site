"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api, { setAccessToken } from "./api";
import { User } from "./types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, display_name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.post("/auth/refresh");
      setAccessToken(res.data.access_token);
      const me = await api.get("/auth/me");
      setUser(me.data);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshUser(); }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.access_token);
    const me = await api.get("/auth/me");
    setUser(me.data);
  };

  const signup = async (username: string, email: string, password: string, display_name: string) => {
    const res = await api.post("/auth/signup", { username, email, password, display_name });
    setAccessToken(res.data.access_token);
    const me = await api.get("/auth/me");
    setUser(me.data);
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
