// src/pages/host/HostSettings.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import HostHeader from "../../components/HostHeader";
import {
  UserCircleIcon,
  GlobeAltIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const HostSettings = () => {
  const [form, setForm] = useState({ username: "", timezone: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ---------- preload current values ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/host/settings");
        setForm({ username: data.username || "", timezone: data.timezone || "" });
      } catch {}
    })();
  }, []);

  /* ---------- handlers ---------- */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await axiosInstance.put("/host/settings", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HostHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-white">Host Settings</h1>
            <p className="text-blue-100 mt-1">Update your profile and preferences</p>
          </header>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <UserCircleIcon className="w-5 h-5 text-blue-600" /> Username
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Timezone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <GlobeAltIcon className="w-5 h-5 text-blue-600" /> Timezone
                </label>
                <input
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  placeholder="e.g. Asia/Karachi"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold shadow transition ${loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                  }`}
              >
                {loading ? "Saving…" : saved ? <span className="flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Saved!</span> : "Save Settings"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HostSettings;