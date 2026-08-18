import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = api.currentUser ? api.currentUser() : null;
    if (current) setUser(current);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("auth/login/", { email, password });
    // store minimal auth info
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    // api.post returns user directly in demo mode
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (userData) => {
    const res = await api.post("auth/register/", userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    if (api.logout) api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
