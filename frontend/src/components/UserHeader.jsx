// src/components/UserHeader.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

const UserHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try { await logout(); }
    catch (err) { console.error("Logout failed", err); }
    finally { navigate("/", { replace: true }); }
  };

  const roleLabel = (user?.role ?? "guest").toUpperCase();

  return (
    <header className="bg-blue-600 text-white p-4 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-6">
        <h1 className="text-lg font-bold">Dashboard ({roleLabel})</h1>
        <nav className="space-x-4">
          <NavLink
            to="/user/availability"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : ""
            }
          >
            Hosts Availability
          </NavLink>
          <NavLink
            to="/user/bookings"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : ""
            }
          >
            My Bookings
          </NavLink>
          <NavLink
            to="/user/meeting-room"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : ""
            }
          >
            Join Meeting
          </NavLink>

        </nav>
      </div>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded mt-2 md:mt-0">
        Logout
      </button>
    </header>
  );
};

export default UserHeader;
