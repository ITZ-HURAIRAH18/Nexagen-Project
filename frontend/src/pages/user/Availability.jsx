// src/pages/user/Availability.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import UserHeader from "../../components/userHeader";

const Availability = () => {
  const [hosts, setHosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/user/hosts/availability")
      .then(res => setHosts(res.data.availability))
      .catch(err => console.error(err));
  }, []);

  const handleBook = (host) => {
    navigate(`/user/book/${host.hostId._id}`);
  };


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
  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold mb-4">Hosts Availability</h2>

        {hosts.length === 0 ? (
          <p>No hosts available right now.</p>
        ) : (
          hosts.map(h => (
            <div key={h._id} className="border p-4 rounded bg-white shadow space-y-2">
              <h3 className="text-lg font-semibold">{h.hostId.name}</h3>
              <p><span className="font-medium">Email:</span> {h.hostId.email}</p>
              <p><span className="font-medium">Timezone:</span> {h.timezone || "Not specified"}</p>

              <div className="mt-2">
                <h4 className="font-medium">Weekly Availability:</h4>
                {h.weekly.length === 0 ? (
                  <p>No weekly availability set.</p>
                ) : (
                  h.weekly.map((d, i) => (
                    <p key={i}>
                      <span className="font-medium">{d.day}:</span>{" "}
                      {formatTime(d.start)} - {formatTime(d.end)}
                    </p>
                  ))
                )}
              </div>

              <p><span className="font-medium">Meeting Durations:</span> {h.durations.join(", ")} mins</p>
              <p><span className="font-medium">Buffer Time (Before/After):</span> {h.bufferBefore}/{h.bufferAfter} mins</p>
              <p><span className="font-medium">Max Meetings Per Day:</span> {h.maxPerDay}</p>

              {h.blockedDates.length > 0 && (
                <div>
                  <h4 className="font-medium">Blocked Dates:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {h.blockedDates.map((date, i) => (
                      <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {date}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleBook(h)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Book
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Availability;
