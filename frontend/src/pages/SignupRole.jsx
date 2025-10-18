import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const SignupRole = () => {
  const { roleParam } = useParams(); // "user" or "host"
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: roleParam });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/auth/signup", form); // ✅ ensure correct route
      setSuccess(res.data.message || "Signup successful");
      setError("");
      setTimeout(() => navigate(`/login/${roleParam}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (response) => {
    if (!response?.credential) {
      setError("Google Sign-In failed: no credential");
      return;
    }
    try {
      const res = await axios.post("/auth/google-signup", { token: response.credential, role: form.role });
      setSuccess(res.data.message || "Google signup successful");
      setError("");
      setTimeout(() => navigate(`/login/${roleParam}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Google signup failed");
      setSuccess("");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sign Up ({form.role.toUpperCase()})</h1>

      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-80">
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button disabled={loading} className="bg-blue-600 text-white w-full py-2 rounded">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </form>

      <div className="mt-4">
        <GoogleLogin
          onSuccess={handleGoogleSignup}
          onError={() => setError("Google Sign-In failed")}
        />
      </div>
    </div>
  );
};

export default SignupRole;
