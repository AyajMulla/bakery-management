import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import { Lock, Phone, LogIn, KeyRound, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(mobile, password);

if (success) {
  toast.success("Welcome back owner👋");
  navigate("/");
} else {
  toast.error("Invalid credentials");
}
  };  

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* ANIMATED FLOATING LOGO */}
        <div className="login-icon-box">
          <div className="pulse-ring"></div>
          <ShieldCheck size={40} color="white" />
        </div>

        <div className="login-header">
          <h2>Owner Login</h2>
          <p>Taj Enterprises Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* MOBILE INPUT - SLIDE IN 1 */}
          <div className="input-group slide-in-1">
            <Phone size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD INPUT - SLIDE IN 2 */}
          <div className="input-group slide-in-2">
            <KeyRound size={18} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* SUBMIT BUTTON - SLIDE IN 3 */}
          <button className="primary login-submit slide-in-3" type="submit">
            <span>Login to Dashboard</span>
            <LogIn size={20} />
          </button>

          <div className="login-footer slide-in-4">
            <a href="/forgot-password">Trouble logging in?</a>
          </div>
        </form>
      </div>

      <style>{`
        .login-page-wrapper {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          perspective: 1000px; /* Enables 3D rotation */
        }

        .login-card {
          background: var(--card-bg);
          width: 100%;
          max-width: 420px;
          padding: 50px 40px;
          border-radius: 24px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-light);
          text-align: center;
          animation: cardEntrance 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }

        @keyframes cardEntrance {
          from { 
            opacity: 0; 
            transform: translateY(30px) rotateX(-10deg); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) rotateX(0); 
          }
        }

        .login-icon-box {
          width: 80px;
          height: 80px;
          background: var(--primary);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          position: relative;
          box-shadow: 0 10px 20px rgba(109, 76, 65, 0.3);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 22px;
          border: 2px solid var(--primary);
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .slide-in-1 { animation: slideUp 0.6s ease-out 0.2s backwards; }
        .slide-in-2 { animation: slideUp 0.6s ease-out 0.3s backwards; }
        .slide-in-3 { animation: slideUp 0.6s ease-out 0.4s backwards; }
        .slide-in-4 { animation: slideUp 0.6s ease-out 0.5s backwards; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          transition: color 0.3s;
        }

        .input-group input {
          width: 100%;
          height: 52px;
          padding: 0 15px 0 45px;
          border-radius: 14px;
          border: 1.5px solid var(--border);
          background: var(--bg);
          font-family: inherit;
          transition: all 0.3s;
        }

        .input-group input:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(109, 76, 65, 0.1);
        }

        .input-group input:focus + .input-icon {
          color: var(--primary);
        }

        .login-submit {
          width: 100%;
          height: 52px;
          margin-top: 10px;
          border-radius: 14px;
          font-size: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .login-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(109, 76, 65, 0.4);
        }

        .login-footer a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}