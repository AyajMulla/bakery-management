import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const { sendOTP, verifyOTPAndResetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [timer, setTimer] = useState(0);

  /* =========================
     OTP TIMER
  ========================= */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await sendOTP(email);
      toast.success("OTP sent to your email");
      setStep(2);
      setTimer(60); // ⏳ 60 seconds lock
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
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
      toast.error(err.message || "Invalid OTP");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "auto" }}>
      <h2>Reset Password</h2>

      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <input
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="primary" disabled={timer > 0}>
            {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleReset}>
          <input
            placeholder="Enter OTP"
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

          <button
            type="button"
            disabled={timer > 0}
            onClick={handleSendOTP}
            style={{ marginTop: 10 }}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </form>
      )}
    </div>
  );
}
