import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";

const EditAvailability = () => {
  const { id } = useParams(); // get availability ID from URL
  const navigate = useNavigate();

  const [weekly, setWeekly] = useState([{ day: "", start: "", end: "" }]);
  const [bufferBefore, setBufferBefore] = useState(10);
  const [bufferAfter, setBufferAfter] = useState(10);
  const [durations, setDurations] = useState(30);
  const [maxPerDay, setMaxPerDay] = useState(5);
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch availability data by ID
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axiosInstance.get(`/host/availability/${id}`);
        const data = res.data;
        setWeekly(data.weekly || [{ day: "", start: "", end: "" }]);
        setBufferBefore(data.bufferBefore || 10);
        setBufferAfter(data.bufferAfter || 10);
        setDurations(data.durations?.[0] || 30);
        setMaxPerDay(data.maxPerDay || 5);
        setTimezone(data.timezone || "Asia/Karachi");
        setBlockedDates(data.blockedDates || []);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch availability data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading availability...
      </div>
    );

  // Handle weekly slot changes
  const handleSlotChange = (index, field, value) => {
    const updated = weekly.map((w, i) => (i === index ? { ...w, [field]: value } : w));
    setWeekly(updated);
  };

  const handleAddSlot = () => setWeekly([...weekly, { day: "", start: "", end: "" }]);
  const handleDeleteSlot = (index) => setWeekly(weekly.filter((_, i) => i !== index));

  // Blocked dates handlers
  const handleAddBlockedDate = () => setBlockedDates([...blockedDates, ""]);
  const handleBlockedDateChange = (index, value) => {
    const updated = blockedDates.map((d, i) => (i === index ? value : d));
    setBlockedDates(updated);
  };
  const handleRemoveBlockedDate = (index) =>
    setBlockedDates(blockedDates.filter((_, i) => i !== index));

  // Save changes
  const handleSave = async () => {
    try {
      await axiosInstance.put(`/host/availability/update/${id}`, {
        weekly,
        bufferBefore,
        bufferAfter,
        durations: [durations],
        maxPerDay,
        timezone,
        blockedDates,
      });
      alert("✅ Availability updated successfully!");
      navigate("/host/manage-availability"); // redirect back to manage page
    } catch (error) {
      console.error(error);
      alert("Failed to update availability.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HostHeader />
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">🕓 Edit Availability</h2>

        {/* Weekly Slots */}
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
                onChange={(e) => handleSlotChange(index, "day", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                className="border p-2 rounded w-full"
                value={slot.start}
                onChange={(e) => handleSlotChange(index, "start", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                className="border p-2 rounded w-full"
                value={slot.end}
                onChange={(e) => handleSlotChange(index, "end", e.target.value)}
              />
            </div>
            <button
              onClick={() => handleDeleteSlot(index)}
              className="col-span-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete Slot
            </button>
          </div>
        ))}
        <button
          onClick={handleAddSlot}
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

        {/* Blocked Dates */}
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

        {/* Save */}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          💾 Save Changes
        </button>
        <button
          onClick={() => navigate("/host/manage-availability")}
          className="mt-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditAvailability;
