import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserHeader from "../../components/userHeader";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/user/bookings");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setError(err.response?.data?.message || "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">You have no bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Host: {b.hostId?.fullName || "Unknown"}
                </h3>

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Start:</strong> {new Date(b.start).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>End:</strong> {new Date(b.end).toLocaleString()}
                </p>
                <p
                  className={`text-sm font-medium mt-2 ${
                    b.status === "confirmed"
                      ? "text-green-600"
                      : b.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {b.status.toUpperCase()}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  {b.meetingLink ? (
                    <a
                      href={b.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">No link yet</span>
                  )}

                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm hover:bg-indigo-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🧩 Modal for Full Booking Details */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Booking Details
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Host:</strong> {selectedBooking.hostId?.fullName}</p>
              <p><strong>Email:</strong> {selectedBooking.hostId?.email}</p>
              <p><strong>Guest Name:</strong> {selectedBooking.guest?.name}</p>
              <p><strong>Guest Email:</strong> {selectedBooking.guest?.email}</p>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(selectedBooking.start).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(selectedBooking.end).toLocaleString()}
              </p>
              <p><strong>Duration:</strong> {selectedBooking.duration} mins</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              {selectedBooking.meetingLink && (
                <p>
                  <strong>Meeting Link:</strong>{" "}
                  <a
                    href={selectedBooking.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Join Meeting
                  </a>
                </p>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
