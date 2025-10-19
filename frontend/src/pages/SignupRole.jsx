import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useParams, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignupRole = () => {
  const { roleParam } = useParams();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: roleParam });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roleLabel = { user: "User", host: "Host" }[roleParam] || "User";

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/auth/signup", form);
      setSuccess(res.data.message || "Account created successfully");
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
      setLoading(true);
      const res = await axios.post("/auth/google-signup", { token: response.credential, role: form.role });
      setSuccess(res.data.message || "Google signup successful");
      setError("");
      setTimeout(() => navigate(`/login/${roleParam}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Google signup failed");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-md mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
            <p className="text-sm text-slate-500 mt-1">Join as a {roleLabel}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-3 text-xs text-slate-400">Or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => setError("Google Sign-In failed")}
              useOneTap
              theme="filled_black"
              size="large"
              text="signup_with"
              shape="rectangular"
            />
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              to={`/login/${roleParam}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <Link
          to="/"
          className="block text-center mt-6 text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default SignupRole;