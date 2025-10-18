import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to ScheduleEase</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Manage your time, appointments, and meetings efficiently with our scheduling platform.
      </p>
      <div className="flex gap-4">
        <Link to="/login/user" className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100">
          User Login
        </Link>
        <Link to="/signup/user" className="bg-transparent border border-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-blue-600">
          User Sign Up
        </Link>
        <Link to="/login/host" className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100">
          Host Login
        </Link>
        <Link to="/signup/host" className="bg-transparent border border-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-blue-600">
          Host Sign Up
        </Link>
        <Link to="/login/admin" className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100">
          Admin Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;
