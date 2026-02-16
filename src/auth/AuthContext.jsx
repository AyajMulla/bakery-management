import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const DEFAULT_PASSWORD = "Ayaj@123";
  const REGISTERED_MOBILE = "9359405574"; // 👈 OWNER MOBILE

  useEffect(() => {
    if (!localStorage.getItem("ownerPassword")) {
      localStorage.setItem("ownerPassword", DEFAULT_PASSWORD);
    }

    if (!localStorage.getItem("ownerMobile")) {
      localStorage.setItem("ownerMobile", REGISTERED_MOBILE);
    }

    if (localStorage.getItem("isAuthenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    const savedPassword = localStorage.getItem("ownerPassword");

    if (username === "Ayaj" && password === savedPassword) {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  /* =========================
     OTP PASSWORD RESET
  ========================= */

  const sendOTP = (mobile) => {
    const savedMobile = localStorage.getItem("ownerMobile");

    if (mobile !== savedMobile) {
      return { success: false, message: "Mobile number not registered" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("resetOTP", otp.toString());

    console.log("OTP (for demo):", otp); // 👈 simulate SMS

    return { success: true };
  };

  const verifyOTPAndResetPassword = (otp, newPassword) => {
    const savedOTP = localStorage.getItem("resetOTP");

    if (otp !== savedOTP) {
      return { success: false, message: "Invalid OTP" };
    }

    localStorage.setItem("ownerPassword", newPassword);
    localStorage.removeItem("resetOTP");
    localStorage.removeItem("isAuthenticated");

    setIsAuthenticated(false);

    return { success: true };
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
