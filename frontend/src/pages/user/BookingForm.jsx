// src/pages/user/BookingForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import UserHeader from "../../components/userHeader";
import toast, { Toaster } from "react-hot-toast";

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

  // ✅ Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // ✅ Fetch host availability
  useEffect(() => {
    axiosInstance
      .get("/user/hosts/availability")
      .then((res) => {
        const h = res.data.availability.find((a) => a.hostId._id === hostId);
        if (h) setHost(h);
      })
      .catch((err) => console.error("Error fetching availability:", err));
  }, [hostId]);

  // ✅ Submit booking with createdByUserId from localStorage
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");

    // ✅ Log the payload before sending
    const payload = {
      hostId,
      start: form.start,
      end: form.end,
      duration: form.duration,
      guest: {
        name: form.name,
        email: form.email,
        phone: form.phone,
      },
      createdByUserId: user.id || user._id, // ✅ manually send user id
    };

    console.log("📦 Booking Payload Sent to API:", payload);

    const response = await axiosInstance.post("/user/bookings", payload);

    console.log("✅ Booking Response:", response.data);

    toast.success(response.data.message || "Booking created successfully!");
    setTimeout(() => navigate("/user/dashboard"), 1500);

  } catch (err) {
    console.error("❌ Booking error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to create booking");
    setError(err.response?.data?.message || "Failed to create booking");
  } finally {
    setLoading(false);
  }
};

  if (!host)
    return (
      <div>
        <UserHeader />
        <div className="text-center py-10 text-gray-600">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <Toaster position="top-center" />
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Book with {host.hostId.fullName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
          />

          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
          />

          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
          />

          <input
            type="datetime-local"
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
          />

          <input
            type="datetime-local"
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
          />

          <select
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
          >
            {host.durations.map((d) => (
              <option key={d} value={d}>
                {d} mins
              </option>
            ))}
          </select>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
