// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logout as logoutService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    setUserState(storedUser);
    setLoading(false);
  }, []);

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    logoutService();
    setUserState(null);
  };

  // ── Ne rien rendre tant que le user n'est pas chargé ──
  // évite un flash de redirection au démarrage
  if (loading) return null;

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      logout,
      loading,
      isAuthenticated: !!user,
      isStaff: !!user?.is_staff,   // ← ajout pour faciliter les guards
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return context;
}