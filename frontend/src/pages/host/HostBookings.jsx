import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";

const HostBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axiosInstance.get("/host/bookings")
      .then((res) => {
        if (res.data.success) setBookings(res.data.bookings);
        console.log(res.data.bookings,"Booking ");
        return
      })
      .catch((err) => console.error("Error fetching bookings:", err));
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
              <th className="p-2 border">Timezone</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="p-2 border">{b.guest?.name || "N/A"}</td>
                <td className="p-2 border">{new Date(b.start).toLocaleString()}</td>
                <td className="p-2 border">{new Date(b.end).toLocaleString()}</td>
                <td className="p-2 border">
                  <select
                    value={b.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await axiosInstance.put(`/host/bookings/update-status/${b._id}`, {
                          status: newStatus,
                        });
                        setBookings((prev) =>
                          prev.map((bk) =>
                            bk._id === b._id ? { ...bk, status: newStatus } : bk
                          )
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

                <td className="p-2 border">
                  {b.availabilityId?.timezone || "N/A"}
                </td>

                <td className="p-2 border text-center">
                  <button
                    onClick={() => setSelected(b)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-4 text-gray-800">Booking Details</h3>

              {/* Booking Info */}
              <div className="space-y-2 text-sm">
                <p><strong>Guest:</strong> {selected.guest?.name} ({selected.guest?.email})</p>
                <p><strong>Status:</strong> {selected.status}</p>
                <p><strong>Start:</strong> {new Date(selected.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(selected.end).toLocaleString()}</p>
              </div>

              <hr className="my-4" />

              {/* Availability Info */}
              {selected.availabilityId ? (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Availability Info</h4>
                  <p><strong>Timezone:</strong> {selected.availabilityId.timezone}</p>
                  <p>
                    <strong>Buffer:</strong>{" "}
                    {selected.availabilityId.bufferBefore} / {selected.availabilityId.bufferAfter} mins
                  </p>
                  <p><strong>Max per day:</strong> {selected.availabilityId.maxPerDay}</p>

                  <div className="mt-2">
                    <strong>Weekly Schedule:</strong>
                    <ul className="list-disc ml-6 mt-1 text-gray-700 text-sm">
                      {selected.availabilityId.weekly.map((w, i) => (
                        <li key={i}>
                          {w.day}: {w.start} - {w.end}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-2">No availability data linked.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostBookings;
