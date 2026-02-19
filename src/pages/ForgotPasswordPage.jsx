import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, KeyRound, Lock, ArrowLeft, RefreshCcw, Timer } from "lucide-react";

export default function ForgotPasswordPage() {
  const { sendOTP, verifyOTPAndResetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [timer, setTimer] = useState(0);

  /* =========================
      OTP TIMER LOGIC
  ========================= */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    try {
      await sendOTP(email);
      toast.success("OTP sent to your email");
      setStep(2);
      setTimer(60); // Reset to 60 seconds
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
      toast.error(err.message || "Invalid OTP or Expired");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* ANIMATED ICON BOX */}
        <div className="login-icon-box">
          <div className="pulse-ring"></div>
          {step === 1 ? <Mail size={35} color="white" /> : <Lock size={35} color="white" />}
        </div>

        <div className="login-header">
          <h2>{step === 1 ? "Reset Password" : "Verify OTP"}</h2>
          <p>{step === 1 ? "Enter registered email" : "Check email for 6-digit code"}</p>
        </div>
<hr className="login-divider" />
        <div className="form-container">
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="login-form slide-in">
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                className="primary login-submit" 
                type="submit" 
                disabled={timer > 0}
              >
                {timer > 0 ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Timer size={18} className="spin-timer" /> Resend in {timer}s
                  </span>
                ) : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleReset} className="login-form slide-in">
              <div className="input-group slide-in-1">
                <ShieldCheck size={18} className="input-icon" />
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="input-group slide-in-2">
                <KeyRound size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </div>

              <button className="primary login-submit slide-in-3" type="submit">
                Reset Password
              </button>

              <div className="action-row slide-in-4">
                <button type="button" className="text-btn" onClick={() => setStep(1)}>
                  <ArrowLeft size={14} /> Change Email
                </button>
                
                <button 
                  type="button" 
                  className="text-btn resend-timer-btn"
                  disabled={timer > 0}
                  onClick={handleSendOTP}
                >
                  <RefreshCcw size={14} className={timer > 0 ? "spin-timer" : ""} />
                  {timer > 0 ? `Wait ${timer}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        /* Previous CSS variables and wrapper styles apply here */
        .login-page-wrapper { min-height: 90vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        
        .login-card {
          background: var(--card-bg);
          width: 100%;
          max-width: 420px;
          padding: 40px;
          border-radius: 24px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-light);
          text-align: center;
          animation: cardEntrance 0.7s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        }

        .login-icon-box {
          width: 75px; height: 75px; background: var(--primary);
          border-radius: 22px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; position: relative; animation: float 3s ease-in-out infinite;
        }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .pulse-ring {
          position: absolute; width: 100%; height: 100%; border-radius: 22px;
          border: 2px solid var(--primary); animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.4); opacity: 0; } }

        .input-group { position: relative; margin-bottom: 18px; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-light); }
        .input-group input { 
          width: 100%; height: 50px; padding: 0 15px 0 45px; border-radius: 12px; 
          border: 1.5px solid var(--border); background: var(--bg); transition: 0.3s;
        }
        .input-group input:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 4px rgba(109,76,65,0.1); }

        .login-submit { 
          width: 100%; height: 50px; border-radius: 12px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }

        .login-submit:disabled { background: #d7ccc8; color: #8d6e63; cursor: not-allowed; opacity: 0.8; }

        .action-row { display: flex; justify-content: space-between; margin-top: 25px; }
        .text-btn { 
          background: none; border: none; color: var(--primary-dark); font-weight: 700; 
          font-size: 0.85rem; display: flex; align-items: center; gap: 6px; cursor: pointer;
        }
        .text-btn:disabled { color: #bdbdbd; cursor: not-allowed; }

        .spin-timer { animation: rotating 2s linear infinite; }
        @keyframes rotating { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Animation Classes */
        .slide-in-1 { animation: slideUp 0.5s ease-out 0.1s backwards; }
        .slide-in-2 { animation: slideUp 0.5s ease-out 0.2s backwards; }
        .slide-in-3 { animation: slideUp 0.5s ease-out 0.3s backwards; }
        .slide-in-4 { animation: slideUp 0.5s ease-out 0.4s backwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}