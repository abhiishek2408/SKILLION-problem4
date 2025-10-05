import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const API_URL = "https://skillion-problem4.onrender.com/api/auth";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(false);

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;

      setToken(token);
      setRole(user.role);
      setUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      const roleLower = user.role.toLowerCase();
      if (roleLower === "admin") navigate("/admin/dashboard");
      else if (roleLower === "creator") navigate("/creator/dashboard");
      else navigate("/dashboard");

      return { success: true, user, role: user.role, token };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, { name, email, password });
      const { id, email: userEmail, message } = res.data;
      return { success: true, message, email: userEmail };
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  // RESEND VERIFICATION
  const resendVerification = async (email) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/resend-verification`, { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Resend failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || "Resend failed" };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isAuthenticated = () => !!token;

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        login,
        register,
        logout,
        resendVerification,
        isAuthenticated,
        authHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
