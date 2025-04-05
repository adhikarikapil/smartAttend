import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, isTokenExpired } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await isTokenExpired();
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      if (response.user) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      console.error("Login Failded: ", error);
      return { error: "Login Failed" };
    }
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      setUser(null);
      return { success: true, message: response.message };
    } catch (error) {
      console.error("Logout Failed: ", error);
      return { success: false, error: "Logout failed" };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
