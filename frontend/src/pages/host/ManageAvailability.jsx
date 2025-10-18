import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";

const ManageAvailability = () => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editSlot, setEditSlot] = useState({ day: "", start: "", end: "" });
  const navigate = useNavigate();

  // 🟢 Fetch Availability of Logged-in Host
  const fetchAvailability = async () => {
    try {
      const res = await axiosInstance.get("/host/availability/me"); // ✅ match backend route
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

  // 🟡 Update a Day
  // start editing a slot inline
  const handleEditStart = (index) => {
    if (!availability) return;
    setEditingIndex(index);
    const slot = availability.weekly[index];
    setEditSlot({ day: slot.day || "", start: slot.start || "", end: slot.end || "" });
  };

  const handleEditCancel = () => {
    setEditingIndex(-1);
    setEditSlot({ day: "", start: "", end: "" });
  };

  const handleEditSave = async (index) => {
    if (!availability) return;
    const updatedWeekly = [...availability.weekly];
    updatedWeekly[index] = { ...updatedWeekly[index], ...editSlot };

    try {
      await axiosInstance.put("/host/availability/update", { ...availability, weekly: updatedWeekly });
      alert("Availability updated!");
      setEditingIndex(-1);
      fetchAvailability();
    } catch (error) {
      console.error("Error updating:", error);
      alert(error.response?.data?.message || "Failed to update availability.");
    }
  };

  // 🔴 Delete a specific day slot
  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    if (!availability) return;
    const updatedWeekly = availability.weekly.filter((_, i) => i !== index);

    try {
      await axiosInstance.put("/host/availability/update", { ...availability, weekly: updatedWeekly });
      alert("Deleted successfully!");
      fetchAvailability();
    } catch (error) {
      console.error("Error deleting slot:", error);
      alert(error.response?.data?.message || "Failed to delete slot.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading availability...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HostHeader />
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Manage My Availability</h2>

        {!availability || !availability.weekly?.length ? (
          <div className="text-center">
            <p className="text-center text-gray-500 mb-4">No availability added yet.</p>
            <button onClick={() => navigate("/host/add-availability")} className="bg-blue-600 text-white px-4 py-2 rounded">Add Availability</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 border">Day</th>
                  <th className="p-2 border">Start Time</th>
                  <th className="p-2 border">End Time</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {availability.weekly.map((slot, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {editingIndex === i ? (
                      <>
                        <td className="border p-2">
                          <input className="border p-1 w-full" value={editSlot.day} onChange={(e) => setEditSlot(s => ({ ...s, day: e.target.value }))} />
                        </td>
                        <td className="border p-2">
                          <input type="time" className="border p-1 w-full" value={editSlot.start} onChange={(e) => setEditSlot(s => ({ ...s, start: e.target.value }))} />
                        </td>
                        <td className="border p-2">
                          <input type="time" className="border p-1 w-full" value={editSlot.end} onChange={(e) => setEditSlot(s => ({ ...s, end: e.target.value }))} />
                        </td>
                        <td className="border p-2 text-center space-x-2">
                          <button onClick={() => handleEditSave(i)} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                          <button onClick={handleEditCancel} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border p-2">{slot.day}</td>
                        <td className="border p-2">{slot.start}</td>
                        <td className="border p-2">{slot.end}</td>
                        <td className="border p-2 text-center space-x-2">
                          <button onClick={() => handleEditStart(i)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                          <button onClick={() => handleDelete(i)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Display additional settings */}
            <div className="mt-6 text-sm bg-gray-50 p-4 rounded-lg">
              <p>
                <strong>Buffer Before:</strong> {availability.bufferBefore} min
              </p>
              <p>
                <strong>Buffer After:</strong> {availability.bufferAfter} min
              </p>
              <p>
                <strong>Duration:</strong> {availability.durations[0]} min
              </p>
              <p>
                <strong>Max Bookings Per Day:</strong> {availability.maxPerDay}
              </p>
              <p>
                <strong>Timezone:</strong> {availability.timezone}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAvailability;
