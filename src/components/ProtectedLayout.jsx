import { Toaster } from "react-hot-toast";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) return <Navigate to="/" />;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="flex h-screen">
        <aside className="w-50 bg-gray-800 p-2">
          <h2 className="text-2xl font-bold text-cyan-400 mb-8">EDUVICKO</h2>
          <nav className="flex flex-col gap-2">
            <Link to="/dashboard" className="p-3 rounded-lg hover:bg-gray-700">
              Dashboard
            </Link>
            <Link to="/students" className="p-3 rounded-lg hover:bg-gray-700">
              Students
            </Link>
            <Link
              to="/registration"
              className="p-3 rounded-lg hover:bg-gray-700"
            >
              Registration
            </Link>
            <Link to="/teachers" className="p-3 rounded-lg hover:bg-gray-700">
              Teachers
            </Link>
            <Link to="/classes" className="p-3 rounded-lg hover:bg-gray-700">
              Classes
            </Link>
            <Link to="/results" className="p-3 rounded-lg hover:bg-gray-700">
              Results
            </Link>
            <Link to="/Fees" className="p-3 rounded-lg hover:bg-gray-700">
              Fees
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded text-red-500 text-left"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ProtectedLayout;
