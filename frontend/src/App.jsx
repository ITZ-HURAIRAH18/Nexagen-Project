import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><h1>Admin Dashboard</h1></ProtectedRoute>} />
        <Route path="/host/dashboard" element={<ProtectedRoute allowedRoles={["host"]}><h1>Host Dashboard</h1></ProtectedRoute>} />
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><h1>User Dashboard</h1></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
