import { createContext, useContext, useMemo, useState } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setToken(response.access_token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context + its hook are intentionally co-located
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
