import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginRole = () => {
  const { roleParam } = useParams(); // "user" or "host" or "admin"
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const role = roleParam; // use param from route

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/auth/login", { ...form, role });
      localStorage.setItem("token", res.data.token);
      setError("");
      redirect(res.data.user.role);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      setLoading(true);
      const role = roleParam;
      const res = await axios.post("/auth/google-login", { token: response.credential, role });
      localStorage.setItem("token", res.data.token);
      setError("");
      redirect(res.data.user.role);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Google login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const redirect = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "host") navigate("/host/dashboard");
    else navigate("/user/dashboard");
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login ({roleParam.toUpperCase()})</h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="bg-blue-600 text-white w-full py-2 rounded">{loading ? "Logging in..." : "Login"}</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      {roleParam !== "admin" && (
        <div className="mt-4">
          <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setError("Google Sign-In failed")} />
        </div>
      )}
    </div>
  );
};

export default LoginRole;
