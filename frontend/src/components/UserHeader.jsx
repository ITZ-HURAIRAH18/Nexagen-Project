  import { useAuth } from "../context/AuthContext";
  import { useNavigate } from "react-router-dom";

  const userHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
      if (!window.confirm("Are you sure you want to logout?")) return;

      try {
        // if logout is async, await it; if not, this still works
        await logout();
      } catch (err) {
        console.error("Logout failed", err);
        // optionally show feedback to the user
      } finally {
        // always send the user back to the landing page
        navigate("/", { replace: true });
      }
    };

    const roleLabel = (user?.role ?? "guest").toString().toUpperCase();

    return (
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Dashboard ({roleLabel})</h1>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </header>
    );
  };

  export default userHeader;