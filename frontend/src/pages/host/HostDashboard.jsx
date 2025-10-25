import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
const HostDashboard = () => {
  const [data, setData] = useState(null);


  useEffect(() => {
    // Fetch initial dashboard data
    axiosInstance.get("/host/dashboard").then((res) => setData(res.data));

    // ✅ Join the host room using hostId from your API
    axiosInstance.get("/host/dashboard").then((res) => {
      const hostId = res.data.hostId;
      socket.emit("join_host_room", hostId); // join Socket.IO room
    });

    // Listen for dashboard updates
    socket.on("host_dashboard_updated", (updatedData) => {
      setData(updatedData);
    });

    // Cleanup on unmount
    return () => socket.off("host_dashboard_updated");
  }, []);


  if (!data) return <p>Loading...</p>;

  const { stats, recentBookings } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <HostHeader />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Host Dashboard</h2>

        <div className="grid md:grid-cols-4 gap-4 mb-6">

          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white p-4 shadow rounded">
              <h3 className="text-gray-600 capitalize">{key}</h3>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          ))}

        </div>

        <h3 className="text-xl font-semibold mb-2">Recent Bookings</h3>
        <ul className="bg-white rounded shadow divide-y">
          {recentBookings.map((b) => (
            <li key={b._id} className="p-3">
              <span className="font-medium">{b.guest.name}</span> —{" "}
              {new Date(b.start).toLocaleString()} ({b.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HostDashboard;
