import { useEffect, useState } from "react";
import AdminHeader from "../../components/adminHeader";
 import axiosInstance from "../../api/axiosInstance";
const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspend = async (id) => {
    if (!window.confirm("Suspend this user?")) return;
    await axiosInstance.patch(`/admin/user/${id}/suspend`);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axiosInstance.delete(`/admin/user/${id}`);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">All Users</h2>
        <table className="w-full table-auto border bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role.toUpperCase()}</td>
                <td className="p-2">{user.suspended ? "Suspended" : "Active"}</td>
                <td className="p-2 space-x-2">
                  {!user.suspended && (
                    <button
                      onClick={() => handleSuspend(user._id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Suspend
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
