// src/pages/user/BookingForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import UserHeader from "../../components/userHeader";
import toast, { Toaster } from "react-hot-toast";
import {
  CalendarDaysIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

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

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* ---------- effects ---------- */
  useEffect(() => {
    if (user) {
      setForm((p) => ({ ...p, name: user.name || p.name, email: user.email || p.email }));
    }
  }, []);

  useEffect(() => {
    if (!host) {
      axiosInstance
        .get("/user/hosts/availability")
        .then((res) => setHost(res.data.availability.find((a) => a.hostId?._id === hostId)))
        .catch(() => {});
    }
  }, [hostId]);

  useEffect(() => {
    if (form.start && form.duration) {
      const start = new Date(form.start);
      const end = new Date(start.getTime() + form.duration * 60000);
      const offset = end.getTimezoneOffset();
      setForm((p) => ({ ...p, end: new Date(end.getTime() - offset * 60000).toISOString().slice(0, 16) }));
    }
  }, [form.start, form.duration]);

  /* ---------- helpers ---------- */
  const formatTime = (t) => {
    if (!t) return "";
    t = t.split(":").slice(0, 2).join(":");
    if (/am|pm/i.test(t)) return t;
    const [h, m] = t.split(":").map(Number);
    return `${(h % 12 || 12).toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        hostId,
        start: form.start,
        end: form.end,
        duration: form.duration,
        guest: { name: form.name, email: form.email, phone: form.phone },
        createdByUserId: user.id || user._id,
      };
      const { data } = await axiosInstance.post("/user/bookings", payload);
      toast.success(data.message || "Booking created!");
      setTimeout(() => navigate("/user/dashboard"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!host)
    return (
      <>
        <UserHeader />
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
          <div className="text-white">Loading…</div>
        </div>
      </>
    );

  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const weeklySlot = host.weekly.find((s) => s.day?.trim().toLowerCase() === todayDay);
  const minTime = weeklySlot?.start || "09:00";
  const maxTime = weeklySlot?.end || "17:00";

  return (
    <>
      <UserHeader />
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <VideoCameraIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Book with {host.hostId?.name || host.hostId?.fullName}</h2>
            <p className="text-sm text-gray-500 mt-1">Pick a slot and confirm your meeting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="+1 234 567 890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4" /> Start Time
              </label>
              <input
                type="datetime-local"
                value={form.start}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Host available: {formatTime(minTime)} - {formatTime(maxTime)}</p>
            </div>

            {/* End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ClockIcon className="w-4 h-4" /> End Time
              </label>
              <input
                type="datetime-local"
                value={form.end}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Duration</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {host.durations.map((d) => (
                  <option key={d} value={d}>
                    {d} mins
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-600 text-center text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg"}`}
            >
              {loading ? "Submitting..." : "Book Now"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingForm;