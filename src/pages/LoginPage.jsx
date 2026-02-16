import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import { Lock, User, LogIn, KeyRound, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);

    if (success) {
      toast.success("Welcome, Owner 👋");
      navigate("/");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* ANIMATED LOGO ICON */}
        <div className="login-icon-box">
          <div className="pulse-ring"></div>
          <ShieldCheck size={40} color="white" />
        </div>

        <div className="login-header">
          <h2>Owner Login</h2>
          <p>Taj Enterprises Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group slide-in-1">
            <User size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <button className="primary login-submit slide-in-3" type="submit">
            <span>Login to Dashboard</span>
            <LogIn size={20} />
          </button>

          <div className="login-footer slide-in-4">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}