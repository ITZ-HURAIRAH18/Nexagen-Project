import { useEffect, useState } from "react";
import { UserPlus, Users, Mail, User, Trash2, Edit3 } from "lucide-react";

function App() {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Edit state
  const [editingUser, setEditingUser] = useState(null);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setFetchingUsers(false);
    }
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res, data;
      if (editingUser) {
        // Update
        res = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        data = await res.json();

        if (res.ok) {
          setUsers(users.map((u) => (u._id === editingUser._id ? data.user : u)));
          setMessage("✏️ User updated successfully!");
        } else {
          setMessage(data.message || "❌ Error updating user");
        }
        setEditingUser(null);
      } else {
        // Create
        res = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        data = await res.json();

        if (res.ok) {
          setUsers([...users, data.user]);
          setMessage("✅ User added successfully!");
        } else {
          setMessage(data.message || "❌ Error adding user");
        }
      }

      setFormData({ name: "", email: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        setMessage("🗑️ User deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "❌ Error deleting user");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error occurred");
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-500">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-500 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            User Management System
          </h1>
          <p className="text-gray-600 text-lg">
            Built with React + Node.js + MongoDB Atlas
          </p>
          <div className="flex justify-center items-center space-x-2 mt-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Connected to database</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        {/* Success/Error Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg shadow-sm animate-fade-in">
            {message}
          </div>
        )}

        {/* Add / Edit User Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <UserPlus className="h-7 w-7 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingUser ? "Edit User" : "Add New User"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.email.trim()}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {editingUser ? "Updating User..." : "Adding User..."}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {editingUser ? "Update User" : "Add User"}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-8 pb-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="h-7 w-7 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Users Directory
                </h2>
              </div>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {users.length} {users.length === 1 ? "user" : "users"}
              </div>
            </div>
          </div>

          {fetchingUsers ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users yet
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first user above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <div
                  key={user._id || index}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-gray-600 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-150"
                        title="Edit user"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 border-t text-white-400 text-sm">
        © 2025 User Management System. Built with ❤️ using modern web technologies.
      </footer>
    </div>
  );
}

export default App;
