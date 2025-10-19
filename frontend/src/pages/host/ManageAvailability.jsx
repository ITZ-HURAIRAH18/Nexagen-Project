import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";

const ManageAvailability = () => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editSlot, setEditSlot] = useState({ day: "", start: "", end: "" });

  // 🟢 Fetch Availability of Logged-in Host
  const fetchAvailability = async () => {
    try {
      const res = await axiosInstance.get("/host/availability/me");
      setAvailability(res.data.availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  // ✏️ Start editing
  const handleEditStart = (index) => {
    if (!availability) return;
    const slot = availability.weekly[index];
    setEditingIndex(index);
    setEditSlot({ day: slot.day || "", start: slot.start || "", end: slot.end || "" });
  };

  const handleEditCancel = () => {
    setEditingIndex(-1);
    setEditSlot({ day: "", start: "", end: "" });
  };

  // 💾 Save edited slot
  const handleEditSave = async (index) => {
    const updatedWeekly = [...availability.weekly];
    updatedWeekly[index] = { ...updatedWeekly[index], ...editSlot };

    try {
      await axiosInstance.put("/host/availability/update", {
        ...availability,
        weekly: updatedWeekly,
      });
      alert("Availability updated!");
      setEditingIndex(-1);
      fetchAvailability();
    } catch (error) {
      console.error("Error updating:", error);
      alert(error.response?.data?.message || "Failed to update availability.");
    }
  };

  // ❌ Delete slot
  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    const updatedWeekly = availability.weekly.filter((_, i) => i !== index);

    try {
      await axiosInstance.put("/host/availability/update", {
        ...availability,
        weekly: updatedWeekly,
      });
      alert("Slot deleted successfully!");
      fetchAvailability();
    } catch (error) {
      console.error("Error deleting slot:", error);
      alert(error.response?.data?.message || "Failed to delete slot.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading availability...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <HostHeader />

      <div className="max-w-5xl mx-auto p-8 bg-white shadow-md rounded-lg mt-8">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Manage My Availability
        </h2>

        {!availability || !availability.weekly?.length ? (
          <p className="text-center text-gray-500 text-lg">
            You have not added any availability yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm text-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-800">
                  <th className="p-3 border">Day</th>
                  <th className="p-3 border">Start Time</th>
                  <th className="p-3 border">End Time</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {availability.weekly.map((slot, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    {editingIndex === i ? (
                      <>
                        <td className="border p-2">
                          <input
                            className="border p-1 w-full rounded"
                            value={editSlot.day}
                            onChange={(e) =>
                              setEditSlot((s) => ({ ...s, day: e.target.value }))
                            }
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            className="border p-1 w-full rounded"
                            value={editSlot.start}
                            onChange={(e) =>
                              setEditSlot((s) => ({ ...s, start: e.target.value }))
                            }
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            className="border p-1 w-full rounded"
                            value={editSlot.end}
                            onChange={(e) =>
                              setEditSlot((s) => ({ ...s, end: e.target.value }))
                            }
                          />
                        </td>
                        <td className="border p-2 text-center space-x-2">
                          <button
                            onClick={() => handleEditSave(i)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border p-2 text-center font-medium">
                          {slot.day}
                        </td>
                        <td className="border p-2 text-center">{slot.start}</td>
                        <td className="border p-2 text-center">{slot.end}</td>
                        <td className="border p-2 text-center space-x-2">
                          <button
                            onClick={() => handleEditStart(i)}
                            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(i)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Additional info section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-gray-700">
              <h3 className="text-lg font-semibold mb-2">Other Settings</h3>
              <p><strong>Buffer Before:</strong> {availability.bufferBefore} min</p>
              <p><strong>Buffer After:</strong> {availability.bufferAfter} min</p>
              <p><strong>Duration:</strong> {availability.durations?.[0]} min</p>
              <p><strong>Max Bookings Per Day:</strong> {availability.maxPerDay}</p>
              <p><strong>Timezone:</strong> {availability.timezone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAvailability;
