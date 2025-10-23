// src/components/UserHeader.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
const UserHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try { await logout(); }
    catch (err) { console.error("Logout failed", err); }
    finally { navigate("/", { replace: true }); }
  };

  const navItems = [
    { label: "Availability", path: "/user/availability", icon: <CalendarDaysIcon className="w-4 h-4" /> },
    { label: "My Bookings", path: "/user/bookings", icon: <ClockIcon className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-20 bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: brand + nav */}
          <div className="flex items-center gap-6">
            {/* Logo / App name */}
            <Link to="/user/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="font-semibold hidden sm:inline">ScheduleEase</span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ` +
                    (isActive
                      ? "bg-white/10 text-white"
                      : "text-blue-100 hover:bg-white/10 hover:text-white")
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: user + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-blue-100">
              <UserCircleIcon className="w-5 h-5" />
              <span className="font-medium">{user?.name || "User"}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs">
                {user?.role ?? "guest"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden pb-3 flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ` +
                (isActive
                  ? "bg-white/10 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white")
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;