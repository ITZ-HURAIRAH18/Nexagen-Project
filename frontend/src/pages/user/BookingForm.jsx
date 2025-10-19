// src/pages/user/BookingForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import UserHeader from "../../components/userHeader";

const BookingForm = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    start: "",
    end: "",
    duration: 30,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch host availability
  useEffect(() => {
    axiosInstance.get("/user/hosts/availability")
      .then(res => {
        const h = res.data.availability.find(a => a.hostId._id === hostId);
        if (h) setHost(h);
      })
      .catch(err => console.error(err));
  }, [hostId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.post("/user/bookings", {
        hostId,
        start: form.start,
        end: form.end,
        duration: form.duration,
        guest: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        }
      });
      navigate("/user/dashboard"); // go to dashboard after booking
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!host) return <div><UserHeader />Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Book with {host.hostId.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="datetime-local"
            placeholder="Start Time"
            value={form.start}
            onChange={e => setForm({...form, start: e.target.value})}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            value={form.end}
            onChange={e => setForm({...form, end: e.target.value})}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <select
            value={form.duration}
            onChange={e => setForm({...form, duration: Number(e.target.value)})}
            className="w-full px-3 py-2 border rounded"
          >
            {host.durations.map(d => (
              <option key={d} value={d}>{d} mins</option>
            ))}
          </select>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
