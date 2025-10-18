import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRole from "./pages/LoginRole";
import SignupRole from "./pages/SignupRole";
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/Landing";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/:roleParam" element={<SignupRole />} />
        <Route path="/login/:roleParam" element={<LoginRole />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><h1>Admin Dashboard</h1></ProtectedRoute>} />
        <Route path="/host/dashboard" element={<ProtectedRoute allowedRoles={["host"]}><h1>Host Dashboard</h1></ProtectedRoute>} />
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><h1>User Dashboard</h1></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
