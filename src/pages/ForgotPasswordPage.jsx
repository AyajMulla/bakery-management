import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ForgotPasswordPage() {
  const { sendOTP, verifyOTPAndResetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleSendOTP = (e) => {
    e.preventDefault();
    const res = sendOTP(mobile);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("OTP sent (check console)");
    setStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const res = verifyOTPAndResetPassword(otp, newPass);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Password reset successfully");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "auto" }}>
        <h2>Reset Password</h2>

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <input
              placeholder="Registered Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            <button className="primary">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
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
          </form>
        )}
      </div>
    </div>
  );
}
