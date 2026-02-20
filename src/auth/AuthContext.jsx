import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // 🔐 LOGIN
  const login = async (mobile, password) => {
    try {
      const res = await api.post("/auth/login", {
        mobile,
        password
      });

      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.msg || "Login failed"
      };
    }
  };

  // 📩 SEND OTP (BY MOBILE)
  const sendOTP = async (mobile) => {
    if (!mobile) {
      throw new Error("Mobile number required");
    }

    const res = await api.post("/auth/forgot-password", {
      mobile: mobile.trim()
    });

    return res.data;
  };

  // 🔁 VERIFY OTP + RESET PASSWORD
  const verifyOTPAndResetPassword = async ({
    mobile,
    otp,
    newPassword
  }) => {
    const res = await api.post("/auth/reset-password", {
      mobile: mobile.trim(),
      otp,
      newPassword
    });

    return res.data;
  };

  // 🚪 LOGOUT
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