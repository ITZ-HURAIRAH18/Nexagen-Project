import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

const Signup = () => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      redirect(decoded.role);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post("/auth/google", { token: response.credential });
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      redirect(decoded.role);
    } catch {
      setError("Google signup failed");
    }
  };

  const redirect = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "host") navigate("/host/dashboard");
    else navigate("/user/dashboard");
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
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
          className="border p-2 w-full mb-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded">Sign Up</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <div className="mt-4">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Sign-In failed")} />
      </div>
    </div>
  );
};

export default Signup;
 