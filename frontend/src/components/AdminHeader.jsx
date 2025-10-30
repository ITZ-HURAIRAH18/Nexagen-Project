// src/components/AdminHeader.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try { await logout(); } catch (err) { console.error("Logout failed", err); }
    finally { navigate("/", { replace: true }); }
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Stats", path: "/admin/stats" },
  ];

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand + Role */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="font-semibold hidden sm:inline">Admin Panel</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">{user?.role?.toUpperCase() || "ADMIN"}</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ` +
                  (isActive ? "bg-white text-blue-700" : "text-blue-100 hover:bg-white/10 hover:text-white")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-sm text-blue-100">
              <span className="font-medium">{user?.fullName || "Admin"}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-200 hover:bg-red-500/20 hover:text-red-100 transition"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeade;