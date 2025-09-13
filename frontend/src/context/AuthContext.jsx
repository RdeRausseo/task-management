import React, { createContext, useContext, useState, useEffect } from "react";

//url para nuestra API
const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";
//creamos el contexto
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user ?? null);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.warn("No se pudo cargar perfil:", e);
        setUser(null);
      }
    })();
  }, [token]);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al iniciar sesión");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user ?? null);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function register(username, email, password) {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en registro");
      }
      const data = await res.json();
    
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user ?? null);
      }
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}




