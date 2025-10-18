import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/", { replace: true });
    }
  };

  const roleLabel = (user?.role ?? "guest").toUpperCase();

  const navClass = ({ isActive }) =>
    `px-3 py-1 rounded ${
      isActive ? "bg-white text-blue-600 font-bold" : "text-white hover:bg-blue-500"
    }`;

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <h1 className="text-lg font-bold">Admin ({roleLabel})</h1>
        <nav className="flex space-x-2">
          <NavLink to="/admin/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={navClass}>
            Users
          </NavLink>
          <NavLink to="/admin/stats" className={navClass}>
            Stats
          </NavLink>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
