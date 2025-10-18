import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Landing from "./pages/Landing";
import LoginRole from "./pages/LoginRole";
import SignupRole from "./pages/SignupRole";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HostDashboard from "./pages/host/HostDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup/:roleParam" element={<SignupRole />} />
          <Route path="/login/:roleParam" element={<LoginRole />} />

          {/* Protected Dashboards */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <HostDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
