import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ForgotPasswordPage() {
  const { sendOTP, verifyOTPAndResetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await sendOTP(email);
      toast.success("OTP sent to email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP send failed");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await verifyOTPAndResetPassword({
        email,
        otp,
        newPassword: newPass
      });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Reset Password</h2>

      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <input
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="primary">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleReset}>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
          <button className="primary">Reset Password</button>
        </form>
      )}
    </div>
  );
}
