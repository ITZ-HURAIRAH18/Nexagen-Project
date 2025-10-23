import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// 🌍 Public pages
import Landing from "./pages/Landing";
import LoginRole from "./pages/LoginRole";
import SignupRole from "./pages/SignupRole";

// 🛠️ Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStats from "./pages/admin/AdminStats";

// 👨‍💼 Host pages
import HostDashboard from "./pages/host/HostDashboard";
import HostBookings from "./pages/host/HostBookings";
import HostAddAvailability from "./pages/host/AddAvailability";
import HostManageAvailability from "./pages/host/ManageAvailability";
import EditAvailability from "./pages/host/EditAvailability";
import HostSettings from "./pages/host/HostSettings";

// 👤 User pages
import UserDashboard from "./pages/user/UserDashboard";
import Availability from "./pages/user/Availability";
import Bookings from "./pages/user/Bookings";
import BookingForm from "./pages/user/BookingForm";


// 🔒 Protected route wrapper
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ---------- 🌍 PUBLIC ROUTES ---------- */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup/:roleParam" element={<SignupRole />} />
          <Route path="/login/:roleParam" element={<LoginRole />} />

          {/* ---------- 🛠️ ADMIN ROUTES ---------- */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminStats />
              </ProtectedRoute>
            }
          />

          {/* ---------- 👨‍💼 HOST ROUTES ---------- */}
          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <HostDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/bookings"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <HostBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/add-availability"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <HostAddAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/manage-availability"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <HostManageAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/edit-availability/:id"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <EditAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/settings"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <HostSettings />
              </ProtectedRoute>
            }
          />

          {/* ---------- 👤 USER ROUTES ---------- */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/availability"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Availability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/book/:hostId"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <BookingForm />
              </ProtectedRoute>
            }
          />
          

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
