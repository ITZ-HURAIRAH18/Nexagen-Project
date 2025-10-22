// src/pages/user/BookingForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import UserHeader from "../../components/userHeader";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const BookingForm = () => {
const { hostId } = useParams();
const location = useLocation();
const navigate = useNavigate();

const [host, setHost] = useState(location.state?.host || null);

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

useEffect(() => {
  if (!host) {
    axiosInstance
      .get("/user/hosts/availability")
      .then((res) => {
        const h = res.data.availability.find((a) => a.hostId._id === hostId);
        if (h) setHost(h);
      })
      .catch((err) => console.error("Error fetching availability:", err));
  }
}, [host, hostId]);

  // ✅ Auto-calculate end time when start time or duration changes
  useEffect(() => {
    if (form.start && form.duration) {
      const startDate = new Date(form.start);
      const endDate = new Date(startDate.getTime() + form.duration * 60000);
      setForm((prev) => ({ ...prev, end: endDate.toISOString().slice(0, 16) }));
    }
  }, [form.start, form.duration]);

  // 🕒 Helper function to format time as AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm"))
      return timeStr; // already formatted

    let [hours, minutes] = timeStr.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  // ✅ Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

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
        createdByUserId: user.id || user._id,
      };

      console.log("📦 Booking Payload Sent to API:", payload);

      const response = await axiosInstance.post("/user/bookings", payload);

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

  // ✅ Get today's date/time limits from host availability
  const today = new Date();
  const weeklySlot = host.weekly.find(
    (slot) =>
      slot.day.toLowerCase() ===
      today.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  );

  const minTime = weeklySlot ? `${weeklySlot.start}` : "09:00";
  const maxTime = weeklySlot ? `${weeklySlot.end}` : "17:00";

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <Toaster position="top-center" />
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Book with {host.hostId.name || host.hostId.fullName}
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

          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              required
              min={`${new Date().toISOString().slice(0, 16)}`}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
            />
            {/* ✅ Show AM/PM formatted availability */}
            <p className="text-xs text-gray-500 mt-1">
              Host available: {formatTime(minTime)} - {formatTime(maxTime)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="datetime-local"
              value={form.end}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Meeting Duration
            </label>
            <select
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
            >
              {host.durations.map((d) => (
                <option key={d} value={d}>
                  {d} mins
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
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
