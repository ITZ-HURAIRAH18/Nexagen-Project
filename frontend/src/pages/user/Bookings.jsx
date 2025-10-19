// src/pages/user/Bookings.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserHeader from "../../components/userHeader";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axiosInstance.get("/user/bookings")
      .then(res => setBookings(res.data.bookings))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        {bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          <table className="w-full border text-sm text-gray-700 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Host</th>
                <th className="p-2 border">Start</th>
                <th className="p-2 border">End</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Meeting Link</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td className="border p-2">{b.hostId.name}</td>
                  <td className="border p-2">{new Date(b.start).toLocaleString()}</td>
                  <td className="border p-2">{new Date(b.end).toLocaleString()}</td>
                  <td className="border p-2">{b.status}</td>
                  <td className="border p-2">
                    {b.meetingLink ? (
                      <a href={b.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        Join
                      </a>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Bookings;
