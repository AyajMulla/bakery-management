import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  /* =========================
     LOGIN
  ========================= */
  const login = async (mobile, password) => {
    try {
      const res = await api.post("/auth/login", {
        mobile: mobile.trim(),
        password
      });

      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      return false;
    }
  };

  /* =========================
     SEND OTP
  ========================= */
  const sendOTP = async (mobile) => {
    try {
      const res = await api.post("/otp/send", {
        mobile: mobile.trim()
      });

      return { success: true };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "OTP send failed"
      };
    }
  };

  /* =========================
     VERIFY OTP
  ========================= */
  const verifyOTPAndResetPassword = async (mobile, otp, newPassword) => {
    try {
      await api.post("/otp/verify", {
        mobile: mobile.trim(),
        otp,
        newPassword
      });

      return { success: true };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Reset failed"
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        sendOTP,
        verifyOTPAndResetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
