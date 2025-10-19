// src/pages/user/Bookings.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserHeader from "../../components/userHeader";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/user/bookings");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setError(
          err.response?.data?.message || "Failed to fetch bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>

        {/* 🌀 Loading State */}
        {loading ? (
          <p className="text-gray-500">Loading your bookings...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">You have no bookings yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-sm text-gray-700 border border-gray-200">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-3 border">Host</th>
                  <th className="p-3 border">Start</th>
                  <th className="p-3 border">End</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Meeting Link</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border p-3">
                      {b.hostId?.fullName || "Unknown Host"}
                    </td>
                    <td className="border p-3">
                      {new Date(b.start).toLocaleString()}
                    </td>
                    <td className="border p-3">
                      {new Date(b.end).toLocaleString()}
                    </td>
                    <td
                      className={`border p-3 font-medium ${
                        b.status === "confirmed"
                          ? "text-green-600"
                          : b.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </td>
                    <td className="border p-3 text-center">
                      {b.meetingLink ? (
                        <a
                          href={b.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          Join
                        </a>
                      ) : (
                        "-"
                      )}
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

export default Bookings;
