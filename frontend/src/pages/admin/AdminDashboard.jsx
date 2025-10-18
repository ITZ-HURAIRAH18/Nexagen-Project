import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AdminHeader from "../../components/adminHeader";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        if (isMounted) setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        {loading ? (
          <p>Loading dashboard data...</p>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Users */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-gray-700">Total Users</h3>
              <p className="text-2xl font-bold">{data.totalUsers ?? 0}</p>
            </div>

            {/* Total Bookings */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-gray-700">Total Bookings</h3>
              <p className="text-2xl font-bold">{data.totalBookings ?? 0}</p>
            </div>

            {/* Recent Users */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-gray-700">Recent Users</h3>
              <ul className="list-disc pl-5">
                {(data.recentUsers || []).map((user, idx) => (
                  <li key={user._id ?? user.id ?? idx}>
                    {user.fullName ?? "Unknown"} ({user.email ?? "no-email"}) -{" "}
                    {(user.role ?? "user").toString().toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No dashboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
