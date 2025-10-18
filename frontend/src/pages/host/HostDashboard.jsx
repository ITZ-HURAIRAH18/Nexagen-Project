import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import Header from "../../components/Header";

const HostDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance.get("/host/dashboard").then(res => setData(res.data));

  }, []);

  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Host Dashboard</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default HostDashboard;
