import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

const HostHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* App title + role */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">Scheduling Platform</span>
          <span className="text-sm bg-blue-800 px-2 py-1 rounded">
            {user?.role?.toUpperCase() || "HOST"}
          </span>
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {user?.name || "Unknown Host"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="bg-blue-700">
        <ul className="flex space-x-6 px-6 py-2 text-sm">
          <li>
            <NavLink
              to="/host/dashboard"
              className={({ isActive }) =>
                `hover:text-yellow-300 ${isActive ? "font-semibold text-yellow-300" : ""
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/host/bookings"
              className={({ isActive }) =>
                `hover:text-yellow-300 ${isActive ? "font-semibold text-yellow-300" : ""
                }`
              }
            >
              Bookings
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/host/add-availability"
              className={({ isActive }) =>
                `hover:text-yellow-300 ${isActive ? "font-semibold text-yellow-300" : ""
                }`
              }
            >
              Add Availability
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/host/manage-availability"
              className={({ isActive }) =>
                `hover:text-yellow-300 ${isActive ? "font-semibold text-yellow-300" : ""
                }`
              }
            >
              Manage Availability
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/host/settings"
              className={({ isActive }) =>
                `hover:text-yellow-300 ${isActive ? "font-semibold text-yellow-300" : ""
                }`
              }
            >
              Settings
            </NavLink>
          </li>
         

        </ul>
      </nav>
    </header>
  );
};

export default HostHeader;
