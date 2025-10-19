import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";

const HostBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axiosInstance.get("/host/bookings").then((res) => {
      setBookings(res.data.bookings);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <HostHeader />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
        <table className="w-full border bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Guest</th>
              <th className="p-2 border">Start</th>
              <th className="p-2 border">End</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="p-2 border">{b.guest.name}</td>
                <td className="p-2 border">{new Date(b.start).toLocaleString()}</td>
                <td className="p-2 border">{new Date(b.end).toLocaleString()}</td>
                <td className="p-2 border">
                  <select
                    value={b.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        const res = await axiosInstance.put(`/host/bookings/update-status/${b._id}`, {
                          status: newStatus,
                        });
                        // Update local state
                        setBookings((prev) =>
                          prev.map((bk) => (bk._id === b._id ? { ...bk, status: newStatus } : bk))
                        );
                      } catch (err) {
                        console.error("Error updating status:", err);
                      }
                    }}
                    className="border p-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostBookings;
