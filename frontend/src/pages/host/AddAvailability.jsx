// src/pages/host/AddAvailability.jsx
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";
import {
  PlusCircleIcon,
  TrashIcon,
  ClockIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AddAvailability = () => {
  const [weekly, setWeekly] = useState([{ day: "", start: "", end: "" }]);
  const [bufferBefore, setBufferBefore] = useState(10);
  const [bufferAfter, setBufferAfter] = useState(10);
  const [durations, setDurations] = useState(30);
  const [maxPerDay, setMaxPerDay] = useState(5);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [blockedDates, setBlockedDates] = useState([]);

  /* ---------- handlers ---------- */
  const addDay      = () => setWeekly([...weekly, { day: "", start: "", end: "" }]);
  const updateDay   = (i, f, v) => setWeekly((w) => w.map((s, idx) => (idx === i ? { ...s, [f]: v } : s)));
  const removeDay   = (i) => setWeekly((w) => w.filter((_, idx) => idx !== i));

  const addBlocked  = () => setBlockedDates([...blockedDates, ""]);
  const updateBlock = (i, v) => setBlockedDates((d) => d.map((dt, idx) => (idx === i ? v : dt)));
  const removeBlock = (i) => setBlockedDates((d) => d.filter((_, idx) => idx !== i));

  const save = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const hostId = storedUser?.id;
      if (!hostId) return alert("User not found — please log in again.");

      const payload = {
        hostId,
        weekly: weekly.filter((w) => w.day && w.start && w.end),
        bufferBefore: Number(bufferBefore),
        bufferAfter: Number(bufferAfter),
        durations: Number(durations),
        maxPerDay: Number(maxPerDay),
        timezone,
        blockedDates: blockedDates.filter(Boolean),
      };

      await axiosInstance.post("/host/availability/add", payload);
      alert("✅ Availability saved!");
    } catch (err) {
      alert(err?.response?.data?.message || "Save failed");
    }
  };

  /* ---------- render ---------- */
  return (
    <>
      <HostHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 sm:p-8">
          <header className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white mb-3">
              <CalendarDaysIcon className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Your Availability</h1>
            <p className="text-sm text-gray-600 mt-1">Set your schedule and let guests book you easily</p>
          </header>

          {/* Weekly slots */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-blue-600" /> Weekly Schedule
            </h2>
            <div className="space-y-4">
              {weekly.map((slot, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={slot.day}
                      onChange={(e) => updateDay(i, "day", e.target.value)}
                    >
                      <option value="">Select day</option>
                      {daysOfWeek.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                    <input type="time" value={slot.start} onChange={(e) => updateDay(i, "start", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                    <input type="time" value={slot.end} onChange={(e) => updateDay(i, "end", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeDay(i)}
                      className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addDay}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
            >
              <PlusCircleIcon className="w-5 h-5" /> Add Day
            </button>
          </section>

          {/* Settings */}
          <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Before (min)</label>
              <input
                type="number"
                min="0"
                value={bufferBefore}
                onChange={(e) => setBufferBefore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer After (min)</label>
              <input
                type="number"
                min="0"
                value={bufferAfter}
                onChange={(e) => setBufferAfter(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration / Meeting (min)</label>
              <input
                type="number"
                min="15"
                step="15"
                value={durations}
                onChange={(e) => setDurations(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Bookings / Day</label>
              <input
                type="number"
                min="1"
                value={maxPerDay}
                onChange={(e) => setMaxPerDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <GlobeAltIcon className="w-5 h-5 text-blue-600" /> Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </section>

          {/* Blocked Dates */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-blue-600" /> Blocked Dates
            </h2>
            <div className="space-y-3">
              {blockedDates.map((date, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => updateBlock(i, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeBlock(i)}
                    className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addBlocked}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
            >
              <PlusCircleIcon className="w-5 h-5" /> Add Blocked Date
            </button>
          </section>

          {/* Save */}
          <div className="text-center">
            <button
              onClick={save}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transition"
            >
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAvailability;