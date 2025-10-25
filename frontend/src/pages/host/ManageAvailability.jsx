// src/pages/host/ManageAvailability.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";
import EditAvailability from "./EditAvailability";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  ClockIcon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const ManageAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);

  const navigate = useNavigate();

  /* ---------- helpers ---------- */
  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    return `${(h % 12 || 12).toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  /* ---------- data ---------- */
  const fetchAvailability = async () => {
    try {
      const res = await axiosInstance.get("/host/availability/me");
      setAvailability(res.data.availability || []);
    } catch {
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  /* ---------- actions ---------- */
  const handleEdit = (id) => navigate(`/host/edit-availability/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this availability permanently?")) return;
    try {
      await axiosInstance.delete(`/host/availability/delete/${id}`);
      fetchAvailability();
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------- render ---------- */
  return (
    <>
      <HostHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-white">Manage My Availability</h1>
            <p className="text-blue-100 mt-1">Edit, review or remove your schedule</p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-white/80">Loading…</div>
          ) : availability.length === 0 ? (
            <EmptyState onAdd={() => navigate("/host/add-availability")} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availability.map((item) => (
                <AvailabilityCard
                  key={item._id}
                  item={item}
                  formatTime={formatTime}
                  onEdit={() => handleEdit(item._id)}
                  onDelete={() => handleDelete(item._id)}
                  onView={() => setViewData(item)}
                />
              ))}
            </div>
          )}

          {/* View Modal */}
          {viewData && <ViewModal data={viewData} formatTime={formatTime} onClose={() => setViewData(null)} />}
        </div>
      </div>
    </>
  );
};

/* ---------- sub-components ---------- */
const EmptyState = ({ onAdd }) => (
  <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8 text-center">
    <CalendarDaysIcon className="mx-auto h-12 w-12 text-blue-600" />
    <h3 className="mt-3 text-lg font-semibold text-gray-900">No availability yet</h3>
    <p className="mt-1 text-gray-600">Create your first schedule to start accepting bookings.</p>
    <button
      onClick={onAdd}
      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:shadow-md transition"
    >
      <PlusCircleIcon className="w-5 h-5" /> Add Availability
    </button>
  </div>
);

const AvailabilityCard = ({ item, formatTime, onEdit, onDelete, onView }) => (
  <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
          <CalendarDaysIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{item.timezone}</p>
          <p className="text-xs text-gray-500">Timezone</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onView} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
          <EyeIcon className="w-5 h-5" />
        </button>
        <button onClick={onEdit} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition">
          <PencilIcon className="w-5 h-5" />
        </button>
        <button onClick={onDelete} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>

    <div className="space-y-3 text-sm text-gray-700 flex-1">
      <div className="flex items-center gap-2">
        <ClockIcon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">Max / day:</span>
        <span className="font-medium text-gray-900">{item.maxPerDay}</span>
      </div>
      <div className="flex items-center gap-2">
        <ClockIcon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">Buffer:</span>
        <span className="font-medium text-gray-900">
          {item.bufferBefore}/{item.bufferAfter} min
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">Duration:</span>
        <span className="font-medium text-gray-900">{item.durations[0]} min</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-xs font-semibold text-gray-500 mb-2">Weekly Slots</p>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
        {item.weekly.map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-medium w-20">{w.day}:</span> {/* fixed width, full day */}
            <span>
              {formatTime(w.start)} - {formatTime(w.end)}
            </span>
          </div>
        ))}
      </div>
    </div>

  </div>
);

const ViewModal = ({ data, formatTime, onClose }) => (
  <>
    {/* overlay */}
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

    {/* modal */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <XCircleIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Availability Details</h2>

        <div className="space-y-3 text-sm text-gray-700">
          <Row icon={<ClockIcon className="w-4 h-4" />} label="Buffer Before" value={`${data.bufferBefore} min`} />
          <Row icon={<ClockIcon className="w-4 h-4" />} label="Buffer After" value={`${data.bufferAfter} min`} />
          <Row icon={<CalendarDaysIcon className="w-4 h-4" />} label="Duration" value={`${data.durations[0]} min`} />
          <Row icon={<CalendarDaysIcon className="w-4 h-4" />} label="Max / Day" value={data.maxPerDay} />
          <Row icon={<GlobeAltIcon className="w-4 h-4" />} label="Timezone" value={data.timezone} />

          <div>
            <p className="font-semibold text-gray-800 mb-2">Weekly Slots</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.weekly.map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-medium">{w.day}:</span>
                  <span>{formatTime(w.start)} - {formatTime(w.end)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-2">Blocked Dates</p>
            {data.blockedDates.length ? (
              <div className="flex flex-wrap gap-2">
                {data.blockedDates.map((d, i) => (
                  <span key={i} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                    {d}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-xs">None</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </>
);

const Row = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <span className="text-gray-400">{icon}</span>
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default ManageAvailability;