import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const activeLink = navRef.current?.querySelector(".active");
    if (activeLink) {
      setIndicatorStyle({
        width: activeLink.offsetWidth + "px",
        left: activeLink.offsetLeft + "px"
      });
    }
  }, [location, open]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar" ref={navRef}>
        {/* Logo */}
        <div className="logo">
          🥯 <span>Taj Enterprises</span>
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Links */}
        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink to="/products" onClick={() => setOpen(false)}>
            <Package size={18} /> Products
          </NavLink>

          <NavLink to="/reports" onClick={() => setOpen(false)}>
            <FileText size={18} /> Reports
          </NavLink>

          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>

          <div className="active-indicator" style={indicatorStyle}></div>
        </div>
      </nav>
    </div>
  );
}
