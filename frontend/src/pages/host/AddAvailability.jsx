import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";

const AddAvailability = () => {
  const [weekly, setWeekly] = useState([{ day: "", start: "", end: "" }]);
  const [bufferBefore, setBufferBefore] = useState(10);
  const [bufferAfter, setBufferAfter] = useState(10);
  const [durations, setDurations] = useState(30); // ✅ Added — was missing
  const [maxPerDay, setMaxPerDay] = useState(5);
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [blockedDates, setBlockedDates] = useState([]);

  // ➕ Add new day slot
  const handleAddDay = () => {
    setWeekly([...weekly, { day: "", start: "", end: "" }]);
  };

  // 🔁 Update day slot
  const handleChange = (index, field, value) => {
    const updated = weekly.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setWeekly(updated);
  };

  // ➕ Add blocked date
  const handleAddBlockedDate = () => {
    setBlockedDates([...blockedDates, ""]);
  };

  // 🔁 Update blocked date
  const handleBlockedDateChange = (index, value) => {
    const updated = blockedDates.map((d, i) => (i === index ? value : d));
    setBlockedDates(updated);
  };

  // ❌ Remove blocked date
  const handleRemoveBlockedDate = (index) => {
    setBlockedDates(blockedDates.filter((_, i) => i !== index));
  };

  // 💾 Save availability
  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const hostId = storedUser?.id; // ✅ get hostId from localStorage

      if (!hostId) {
        alert("User not found — please log in again.");
        return;
      }

      const payload = {
        hostId,
        weekly,
        bufferBefore: Number(bufferBefore),
        bufferAfter: Number(bufferAfter),
        durations: Number(durations),
        maxPerDay: Number(maxPerDay),
        timezone,
        blockedDates,
      };

      const res = await axiosInstance.post("/host/availability/add", payload);
      alert("✅ Availability added successfully!");
      console.log(res.data);
    } catch (error) {
      console.error("Failed to add availability:", error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add availability"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HostHeader />
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          🕓 Add Your Availability
        </h2>

        {/* Weekly Availability Section */}
        <h3 className="font-semibold mb-2">Set Available Days & Times</h3>
        {weekly.map((slot, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-3 mb-3 border p-3 rounded-md"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <input
                type="text"
                placeholder="e.g. Monday"
                className="border p-2 rounded w-full"
                value={slot.day}
                onChange={(e) => handleChange(index, "day", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                className="border p-2 rounded w-full"
                value={slot.start}
                onChange={(e) => handleChange(index, "start", e.target.value)}
              />
              {slot.start && (
                <p className="text-xs text-gray-500 mt-1">
                  {Number(slot.start.split(":")[0]) >= 12 ? "PM" : "AM"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                className="border p-2 rounded w-full"
                value={slot.end}
                onChange={(e) => handleChange(index, "end", e.target.value)}
              />
              {slot.end && (
                <p className="text-xs text-gray-500 mt-1">
                  {Number(slot.end.split(":")[0]) >= 12 ? "PM" : "AM"}
                </p>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={handleAddDay}
          className="bg-gray-200 px-3 py-1 rounded mb-5 hover:bg-gray-300"
        >
          + Add Another Day
        </button>

        {/* Additional Settings */}
        <h3 className="font-semibold mb-2">Additional Settings</h3>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Buffer Before (minutes)
            </label>
            <input
              type="number"
              value={bufferBefore}
              onChange={(e) => setBufferBefore(Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Buffer After (minutes)
            </label>
            <input
              type="number"
              value={bufferAfter}
              onChange={(e) => setBufferAfter(Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration per Booking (minutes)
            </label>
            <input
              type="number"
              value={durations}
              onChange={(e) => setDurations(Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Max Bookings Per Day
            </label>
            <input
              type="number"
              value={maxPerDay}
              onChange={(e) => setMaxPerDay(Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Timezone */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Timezone</label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Blocked Dates Section */}
        <h3 className="font-semibold mb-2">Blocked Dates</h3>
        {blockedDates.map((date, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="date"
              value={date}
              onChange={(e) => handleBlockedDateChange(index, e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={() => handleRemoveBlockedDate(index)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={handleAddBlockedDate}
          className="bg-gray-200 px-3 py-1 rounded mb-5 hover:bg-gray-300"
        >
          + Add Blocked Date
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          💾 Save Availability
        </button>
      </div>
    </div>
  );
};

export default AddAvailability;
