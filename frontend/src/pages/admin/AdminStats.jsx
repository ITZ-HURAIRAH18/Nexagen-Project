import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AdminHeader from "../../components/adminHeader";


const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Stats</h2>

        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Bookings */}
            <div className="bg-white p-6 rounded shadow flex flex-col items-center">
              <h3 className="text-gray-700 font-semibold mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
            </div>

            {/* Active Hosts */}
            <div className="bg-white p-6 rounded shadow flex flex-col items-center">
              <h3 className="text-gray-700 font-semibold mb-2">Active Hosts</h3>
              <p className="text-3xl font-bold">{stats.activeHosts}</p>
            </div>

            {/* Top Hosts */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-gray-700 font-semibold mb-2">Top Hosts</h3>
              <ul className="list-disc pl-5">
                {stats.topHosts?.map((host) => (
                  <li key={host._id}>
                    {host._id} — {host.totalBookings} bookings
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No stats available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminStats;
