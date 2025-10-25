// src/components/HostHeader.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  ClockIcon,
  CogIcon,
  PlusCircleIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";

const HostHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try { await logout(); } catch (err) { console.error("Logout failed", err); }
    finally { navigate("/", { replace: true }); }
  };

  const navItems = [
    { label: "Dashboard", path: "/host/dashboard", icon: <ViewColumnsIcon className="w-4 h-4 hidden sm:inline" /> },
    { label: "Bookings", path: "/host/bookings", icon: <ClockIcon className="w-4 h-4 hidden sm:inline" /> },
    { label: "Add Availability", path: "/host/add-availability", icon: <PlusCircleIcon className="w-4 h-4 hidden sm:inline" /> },
    { label: "Manage", path: "/host/manage-availability", icon: <CalendarDaysIcon className="w-4 h-4 hidden sm:inline" /> },
    { label: "Settings", path: "/host/settings", icon: <CogIcon className="w-4 h-4 hidden sm:inline" /> },
  ];

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand + Role */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-semibold hidden sm:inline">ScheduleEase</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">{user?.role?.toUpperCase() || "HOST"}</span>
          </div>

          {/* NAV  –  centered, single line */}
          <nav className="flex-1 flex justify-center">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ` +
                    (isActive ? "bg-white/10 text-white" : "text-blue-100 hover:bg-white/10 hover:text-white")
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-blue-100">
              <span className="font-medium">{user?.name || "Unknown Host"}</span>
            </div>
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

export default HostHeader;