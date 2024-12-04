"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient } from "@/app/lib/api/base";
import { User } from "@/app/lib/api/auth";

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 從 localStorage 恢復登入狀態
    const storedToken = apiClient.getToken();
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    // 監聽認證事件
    const handleAuthRequired = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem("user");
      // 可以在這裡添加重定向到登入頁面的邏輯
      window.location.href = "/login";
    };

    window.addEventListener("auth:required", handleAuthRequired);
    return () => {
      window.removeEventListener("auth:required", handleAuthRequired);
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    apiClient.setToken(newToken);
    ``;
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    apiClient.clearToken();
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
