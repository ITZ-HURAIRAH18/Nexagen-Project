import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";
import EditAvailability from "./EditAvailability";
import { useNavigate } from "react-router-dom";

const ManageAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState(null); // for modal
  const [editData, setEditData] = useState(null); // for edit page/modal
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/host/edit-availability/${id}`);
  };

  // Fetch availability of logged-in host
  const fetchAvailability = async () => {
    try {
      const res = await axiosInstance.get("/host/availability/me");
      setAvailability(res.data.availability || []); // don't wrap in []
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAvailability();
  }, []);

  // Delete availability
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this availability?")) return;
    try {
      await axiosInstance.delete(`/host/availability/delete/${id}`);

      alert("✅ Availability deleted successfully!");
      fetchAvailability();
    } catch (error) {
      console.error(error);
      alert("Failed to delete availability.");
    }
  };

  return (
  <div className="min-h-screen bg-gray-50">
    <HostHeader />

    <div className="max-w-6xl mx-auto p-8 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Manage My Availability
      </h2>

      {loading ? (
        <div className="flex items-center justify-center text-gray-500">
          Loading availability...
        </div>
      ) : availability.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <p>No availability data found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm text-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="p-3 border">Day(s)</th>
                <th className="p-3 border">Start-End</th>
                <th className="p-3 border">Max Per Day</th>
                <th className="p-3 border">Timezone</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="border p-2 text-center">
                    {item.weekly.map((w) => w.day).join(", ")}
                  </td>
                  <td className="border p-2 text-center">
                    {item.weekly.map((w) => `${w.start}-${w.end}`).join(", ")}
                  </td>
                  <td className="border p-2 text-center">{item.maxPerDay}</td>
                  <td className="border p-2 text-center">{item.timezone}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => setViewData(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {viewData && (
        <div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Availability Details</h3>
            <p><strong>Buffer Before:</strong> {viewData.bufferBefore} min</p>
            <p><strong>Buffer After:</strong> {viewData.bufferAfter} min</p>
            <p><strong>Duration:</strong> {viewData.durations[0]} min</p>
            <p><strong>Max Per Day:</strong> {viewData.maxPerDay}</p>
            <p><strong>Timezone:</strong> {viewData.timezone}</p>
            <p className="mt-2 font-semibold">Weekly Slots:</p>
            <ul className="list-disc list-inside mb-2">
              {viewData.weekly.map((w, i) => (
                <li key={i}>{w.day}: {w.start} - {w.end}</li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">Blocked Dates:</p>
            <ul className="list-disc list-inside">
              {viewData.blockedDates.length
                ? viewData.blockedDates.map((d, i) => <li key={i}>{d}</li>)
                : <li>None</li>
              }
            </ul>
            <button
              onClick={() => setViewData(null)}
              className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal/Page */}
      {editData && (
        <EditAvailability
          availability={editData}
          onClose={() => { setEditData(null); fetchAvailability(); }}
        />
      )}
    </div>
  </div>
);
};

export default ManageAvailability;
