import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import Header from "../../components/Header";
const UserDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance.get("/user/bookings").then(res => setData(res.data));


  }, []);

  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">User Dashboard</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default UserDashboard;
