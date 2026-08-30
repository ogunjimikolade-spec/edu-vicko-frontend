import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/stats/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        
        <div className="bg-purple-700 p-6 rounded-lg text-center">
          <h3 className="text-gray-400">Students</h3>
          <p className="text-3xl font-bold text-white">
            {loading ? "..." : stats.students}
          </p>
        </div>

        <div className="bg-purple-700 p-6 rounded-lg text-center">
          <p className="text-gray-400">Teachers</p>
          <p className="text-3xl font-bold text-white">
            {loading ? "..." : stats.teachers}
          </p>
        </div>

        <div className="bg-purple-700 p-6 rounded-lg text-center">
          <p className="text-gray-400">Classes</p>
          <p className="text-3xl font-bold text-white">
            {loading ? "..." : stats.classes}
          </p>
        </div>

      </div>
    </div>
  );
}
