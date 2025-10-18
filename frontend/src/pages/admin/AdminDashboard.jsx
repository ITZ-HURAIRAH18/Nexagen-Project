import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import Header from "../../components/Header";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance.get("/admin/dashboard").then(res => setData(res.data));
    
  }, []);

  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AdminDashboard;
