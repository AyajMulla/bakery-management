import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // LOGIN
  const login = async (mobile, password) => {
    try {
      const res = await api.post("/auth/login", {
        mobile,
        password
      });

      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  // SEND OTP (EMAIL)
  const sendOTP = async (email) => {
    if (!email) {
      throw new Error("Email required");
    }

    const res = await api.post("/otp/send", {
      email: email.trim()
    });

    return res.data;
  };

  // VERIFY OTP + RESET PASSWORD
  const verifyOTPAndResetPassword = async ({ email, otp, newPassword }) => {
    const res = await api.post("/otp/verify", {
      email: email.trim(),
      otp,
      newPassword
    });

    return res.data;
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
