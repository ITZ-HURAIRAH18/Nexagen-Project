import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";

const HostSettings = () => {
  const [form, setForm] = useState({ username: "", timezone: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axiosInstance.put("/host/settings", form);
    alert("Settings updated!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HostHeader />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Host Settings</h2>
        <div className="space-y-4 max-w-md bg-white p-4 rounded shadow">
          <div>
            <label className="block mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Timezone</label>
            <input
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostSettings;
