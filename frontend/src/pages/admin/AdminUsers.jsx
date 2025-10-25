import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AdminHeader from "../../components/adminHeader";
import { Search, Trash2, Ban } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (role = "all") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      let fetchedUsers = res.data;

      if (role !== "all") {
        fetchedUsers = fetchedUsers.filter(
          (user) => user.role.toLowerCase() === role.toLowerCase()
        );
      }

      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(filteredRole);
  }, [filteredRole]);

  const handleSuspend = async (id) => {
    if (!window.confirm("Suspend this user?")) return;
    await axiosInstance.patch(`/admin/user/${id}/suspend`);
    fetchUsers(filteredRole);
  };
  const handleUnSuspend = async (id) => {
    if (!window.confirm("Unsuspend this user?")) return;
    await axiosInstance.patch(`/admin/user/${id}/unsuspend`);
    fetchUsers(filteredRole);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axiosInstance.delete(`/admin/user/${id}`);
    fetchUsers(filteredRole);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>

          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Filter by Role */}
            <select
              value={filteredRole}
              onChange={(e) => setFilteredRole(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="host">Host</option>
              <option value="user">User</option>
            </select>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{user.fullName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "host"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.suspended
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      {!user.suspended && (
                        <button
                          onClick={() => handleSuspend(user._id)}
                          className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                        >
                          <Ban size={14} /> Suspend
                        </button>
                      )}
                       {user.suspended && (
                        <button
                          onClick={() => handleUnSuspend(user._id)}
                          className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                        >
                          <Ban size={14} /> UnSuspend
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
